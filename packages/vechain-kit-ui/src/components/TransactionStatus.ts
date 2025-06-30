import { LitElement, html, css } from 'lit';

// These would be imported from the core package
interface TrackedTransaction {
    id: string;
    status:
        | 'idle'
        | 'building'
        | 'estimating'
        | 'signing'
        | 'broadcasting'
        | 'pending'
        | 'confirmed'
        | 'failed'
        | 'cancelled';
    error?: { userFriendlyMessage: string };
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string, listener: (...args: any[]) => void): void;
}

/**
 * Framework-agnostic transaction status component
 * Can be used in React, Vue, Angular, or vanilla JS
 *
 * Usage:
 * ```html
 * <vk-transaction-status
 *   .transaction=${transaction}
 *   show-cancel-button
 *   @transaction-cancelled=${this.handleCancel}>
 * </vk-transaction-status>
 * ```
 */
export class TransactionStatusComponent extends LitElement {
    static get properties() {
        return {
            transaction: { type: Object },
            showCancelButton: {
                type: Boolean,
                attribute: 'show-cancel-button',
            },
        };
    }

    static styles = css`
        :host {
            display: block;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid var(--vk-border-color, #e2e8f0);
            background: var(--vk-bg-color, #ffffff);
            font-family: var(--vk-font-family, system-ui, sans-serif);
        }

        .status-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .status-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }

        .status-pending {
            background: var(--vk-warning-bg, #fef3c7);
            color: var(--vk-warning-text, #d97706);
            animation: pulse 2s infinite;
        }

        .status-confirmed {
            background: var(--vk-success-bg, #d1fae5);
            color: var(--vk-success-text, #059669);
        }

        .status-failed {
            background: var(--vk-error-bg, #fee2e2);
            color: var(--vk-error-text, #dc2626);
        }

        .status-cancelled {
            background: var(--vk-neutral-bg, #f3f4f6);
            color: var(--vk-neutral-text, #6b7280);
        }

        .status-text {
            flex: 1;
            font-size: 14px;
            color: var(--vk-text-primary, #1f2937);
        }

        .status-message {
            font-size: 12px;
            color: var(--vk-text-secondary, #6b7280);
            margin-top: 4px;
        }

        .error-message {
            color: var(--vk-error-text, #dc2626);
            margin-top: 8px;
            font-size: 12px;
        }

        .cancel-button {
            padding: 6px 12px;
            font-size: 12px;
            border: 1px solid var(--vk-border-color, #e2e8f0);
            border-radius: 4px;
            background: var(--vk-bg-color, #ffffff);
            color: var(--vk-text-primary, #1f2937);
            cursor: pointer;
            transition: all 0.2s;
        }

        .cancel-button:hover {
            background: var(--vk-bg-hover, #f9fafb);
        }

        @keyframes pulse {
            0%,
            100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
    `;

    transaction?: TrackedTransaction;
    showCancelButton = false;
    private _currentStatus: string = 'idle';
    private _errorMessage: string = '';

    private _statusChangeListener = (eventData: {
        status: string;
        error?: { userFriendlyMessage: string };
    }) => {
        this._currentStatus = eventData.status;
        this._errorMessage = eventData.error?.userFriendlyMessage || '';
        this.requestUpdate();
    };

    connectedCallback() {
        super.connectedCallback();
        if (this.transaction) {
            this._currentStatus = this.transaction.status;
            this.transaction.on('statusChange', this._statusChangeListener);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.transaction) {
            this.transaction.off('statusChange', this._statusChangeListener);
        }
    }

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has('transaction')) {
            // Remove old listener
            const oldTransaction = changedProperties.get('transaction');
            if (oldTransaction) {
                oldTransaction.off('statusChange', this._statusChangeListener);
            }

            // Add new listener
            if (this.transaction) {
                this._currentStatus = this.transaction.status;
                this.transaction.on('statusChange', this._statusChangeListener);
            }
        }
    }

    private _getStatusIcon(status: string): string {
        switch (status) {
            case 'pending':
            case 'building':
            case 'estimating':
            case 'signing':
            case 'broadcasting':
                return '⏳';
            case 'confirmed':
                return '✅';
            case 'failed':
                return '❌';
            case 'cancelled':
                return '⏹️';
            default:
                return '⚪';
        }
    }

    private _getStatusText(status: string): string {
        switch (status) {
            case 'building':
                return 'Building transaction...';
            case 'estimating':
                return 'Estimating gas...';
            case 'signing':
                return 'Waiting for signature...';
            case 'broadcasting':
                return 'Broadcasting transaction...';
            case 'pending':
                return 'Transaction pending...';
            case 'confirmed':
                return 'Transaction confirmed!';
            case 'failed':
                return 'Transaction failed';
            case 'cancelled':
                return 'Transaction cancelled';
            default:
                return 'Ready';
        }
    }

    private _getStatusClass(status: string): string {
        switch (status) {
            case 'building':
            case 'estimating':
            case 'signing':
            case 'broadcasting':
            case 'pending':
                return 'status-pending';
            case 'confirmed':
                return 'status-confirmed';
            case 'failed':
                return 'status-failed';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    }

    private _handleCancel() {
        this.dispatchEvent(
            new CustomEvent('transaction-cancelled', {
                detail: { transaction: this.transaction },
                bubbles: true,
            }),
        );
    }

    private _canCancel(): boolean {
        return [
            'building',
            'estimating',
            'signing',
            'broadcasting',
            'pending',
        ].includes(this._currentStatus);
    }

    render() {
        if (!this.transaction) {
            return html`<div class="status-text">No transaction</div>`;
        }

        return html`
            <div class="status-container">
                <div
                    class="status-icon ${this._getStatusClass(
                        this._currentStatus,
                    )}"
                >
                    ${this._getStatusIcon(this._currentStatus)}
                </div>
                <div class="status-content">
                    <div class="status-text">
                        ${this._getStatusText(this._currentStatus)}
                    </div>
                    ${this.transaction.id
                        ? html`
                              <div class="status-message">
                                  Transaction ID:
                                  ${this.transaction.id.slice(0, 10)}...
                              </div>
                          `
                        : ''}
                    ${this._errorMessage
                        ? html`
                              <div class="error-message">
                                  ${this._errorMessage}
                              </div>
                          `
                        : ''}
                </div>
                ${this.showCancelButton && this._canCancel()
                    ? html`
                          <button
                              class="cancel-button"
                              @click=${this._handleCancel}
                          >
                              Cancel
                          </button>
                      `
                    : ''}
            </div>
        `;
    }
}

customElements.define('vk-transaction-status', TransactionStatusComponent);
