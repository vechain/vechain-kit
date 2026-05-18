'use client';

import { useEffect, useRef } from 'react';
import styles from './PinInput.module.css';

type Props = {
    value: string;
    length?: number;
    autoFocus?: boolean;
    onChange: (next: string) => void;
    onComplete?: (full: string) => void;
};

/**
 * Six-cell OTP-style input. Replaces Chakra's `PinInput` + `PinInputField`.
 *
 * Behaviour:
 *   - Auto-advance focus when a digit is entered.
 *   - Backspace on an empty cell goes back and clears the previous cell.
 *   - Paste anywhere distributes digits across cells.
 *   - Only digits are accepted; everything else is filtered.
 */
export function PinInput({
    value,
    length = 6,
    autoFocus = false,
    onChange,
    onComplete,
}: Props) {
    const refs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (autoFocus) refs.current[0]?.focus();
    }, [autoFocus]);

    const digits = value.padEnd(length, ' ').slice(0, length).split('');

    const updateAt = (index: number, ch: string) => {
        const arr = digits.slice();
        arr[index] = ch;
        const joined = arr.join('').replace(/\s/g, '');
        onChange(joined);
        if (joined.length === length) onComplete?.(joined);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (!raw) {
            updateAt(index, '');
            return;
        }
        // Paste from autocomplete or user typing fast — distribute extras.
        if (raw.length > 1) {
            const arr = digits.slice();
            for (let i = 0; i < raw.length && index + i < length; i++) {
                arr[index + i] = raw[i];
            }
            const joined = arr.join('').replace(/\s/g, '');
            onChange(joined);
            const focusIndex = Math.min(index + raw.length, length - 1);
            refs.current[focusIndex]?.focus();
            if (joined.length === length) onComplete?.(joined);
            return;
        }
        updateAt(index, raw);
        if (index < length - 1) refs.current[index + 1]?.focus();
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (e.key === 'Backspace' && !digits[index].trim() && index > 0) {
            e.preventDefault();
            const arr = digits.slice();
            arr[index - 1] = '';
            onChange(arr.join('').replace(/\s/g, ''));
            refs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            refs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            refs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
        if (!pasted) return;
        e.preventDefault();
        const arr = digits.slice();
        for (let i = 0; i < pasted.length && index + i < length; i++) {
            arr[index + i] = pasted[i];
        }
        const joined = arr.join('').replace(/\s/g, '');
        onChange(joined);
        const focusIndex = Math.min(index + pasted.length, length - 1);
        refs.current[focusIndex]?.focus();
        if (joined.length === length) onComplete?.(joined);
    };

    return (
        <div className={styles.row}>
            {Array.from({ length }).map((_, i) => {
                const ch = digits[i].trim();
                return (
                    <input
                        key={i}
                        ref={(el) => {
                            refs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        className={`${styles.cell} ${
                            ch ? styles.cellFilled : ''
                        }`}
                        value={ch}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={(e) => handlePaste(e, i)}
                        aria-label={`Digit ${i + 1}`}
                    />
                );
            })}
        </div>
    );
}
