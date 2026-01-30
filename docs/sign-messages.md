# Sign Messages

## Sign Message

Sign a string, eg "Hello VeChain", with the `useSignMessage()` hook.

```typescript
'use client';

import { ReactElement, useCallback } from 'react';
import {
    useSignMessage,
} from '@vechain/vechain-kit';

export function SigningExample(): ReactElement {
    const {
        signMessage,
        isSigningPending: isMessageSignPending,
        signature: messageSignature,
    } = useSignMessage();

   const handleSignMessage = useCallback(async () => {
        try {
            const signature = await signMessage('Hello VeChain!');
            toast({
                title: 'Message signed!',
                description: `Signature: ${signature.slice(0, 20)}...`,
                status: 'success',
                duration: 1000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Signing failed',
                description:
                    error instanceof Error ? error.message : String(error),
                status: 'error',
                duration: 1000,
                isClosable: true,
            });
        }
    }, [signMessage, toast]);

    return (
        <>
            <button
                onClick={handleSignMessage}
                isLoading={isMessageSignPending}
            >
                Sign Typed Data
            </button>
            {typedDataSignature && (
                <h4>
                    {typedDataSignature}
                </h4>
            )}
        </>
    );
}
```

## Sign Typed Data (EIP712)

Use the `useSignTypedData()` hook to sign structured data.&#x20;

```typescript
'use client';

import { ReactElement, useCallback } from 'react';
import {
    useWallet,
    useSignTypedData,
} from '@vechain/vechain-kit';

// Example EIP-712 typed data
const exampleTypedData = {
    domain: {
        name: 'VeChain Example',
        version: '1',
        chainId: 1,
    },
    types: {
        Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
        ],
    },
    message: {
        name: 'Alice',
        wallet: '0x0000000000000000000000000000000000000000',
    },
    primaryType: 'Person',
};

export function SigningTypedDataExample(): ReactElement {
    const {
        signTypedData,
        isSigningPending: isTypedDataSignPending,
        signature: typedDataSignature,
    } = useSignTypedData();
    
    const { account } = useWallet()

    const handleSignTypedData = useCallback(async () => {
        try {
            const signature = await signTypedData(exampleTypedData, {
                signer: account?.address
            });
            alert({
                title: 'Typed data signed!',
                description: `Signature: ${signature.slice(0, 20)}...`,
                status: 'success',
                duration: 1000,
                isClosable: true,
            });
        } catch (error) {
            alert({
                title: 'Signing failed',
                description:
                    error instanceof Error ? error.message : String(error),
                status: 'error',
                duration: 1000,
                isClosable: true,
            });
        }
    }, [signTypedData, toast, account]);

    return (
        <>
            <button
                onClick={handleSignTypedData}
                isLoading={isTypedDataSignPending}
            >
                Sign Typed Data
            </button>
            {typedDataSignature && (
                <h4>
                    {typedDataSignature}
                </h4>
            )}
        </>
    );
}
```

## Certificate Signing

To authenticate users in your backend (BE) and issue them a JWT (JSON Web Token), you may need to check that the connected user actually holds the private keys of that wallet (assuring he is not pretending to be someone else).&#x20;

The recommended approach is to use `signTypedData` to have the user sign a piece of structured data, ensuring the signed payload is unique for each authentication request.

{% hint style="warning" %}
When using Privy the user owns a smart account (which is a smart contract), and he cannot directly sign a message with the smart account but needs to do it with his Embedded Wallet (the wallet created and secured by Privy). This means that when you verify identities of users connected with social login **you will need to check that the address that signed the message is actually the owner of the smart account**.
{% endhint %}

#### Example usage

{% tabs %}
{% tab title="SignatureWrapperProvider.tsx" %}
Create a provider that will handle the signature verification.

```typescript
import { useSignatureVerification } from "../hooks/useSignatureVerification";
import { Modal, ModalOverlay, ModalContent, VStack, Text, Spinner, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ReactNode, useEffect } from "react";
import { useWallet } from "@vechain/vechain-kit";
import { clearSignature, usePostUser } from "@/hooks";

type Props = {
  children: ReactNode;
};

export const SignatureVerificationWrapper = ({ children }: Props) => {
  const { hasVerified, isVerifying, signature, verifySignature, value } = useSignatureVerification();
  const { account } = useWallet();
  const { t } = useTranslation();

  const { mutate: postUser } = usePostUser();

  useEffect(() => {
    if (account?.address && !signature) {
      verifySignature();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address, signature]);

  useEffect(() => {
    // If user signed the signature we call our backend endpoint
    if (signature && value.user !== "" && value.timestamp !== "" && account?.address) {
      // When you want to execute the mutation:
      postUser({
        address: account.address,
        value: value,
        signature: signature,
      });
    }
  }, [signature, value, account?.address, postUser]);

  // if user disconnects we clear the signature
  useEffect(() => {
    if (!account) {
      clearSignature();
    }
  }, [account]);

  // Only show the modal if we have an account connected AND haven't verified yet AND are not in the process of verifying
  const showModal = !!account?.address && (!hasVerified || !signature);

  return (
    <>
      {children}
      <Modal isOpen={showModal} onClose={() => {}} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent p={6}>
          <VStack spacing={4}>
            {isVerifying ? (
              <>
                <Spinner size="xl" color="primary.500" />
                <Text textAlign="center" fontSize="lg">
                  {t("Please sign the message to verify your wallet ownership")}
                </Text>
              </>
            ) : (
              <>
                <Text textAlign="center" fontSize="lg">
                  {t("Signature verification is mandatory to proceed. Please try again.")}
                </Text>
                <Button onClick={verifySignature} colorScheme="secondary">
                  {t("Try Again")}
                </Button>
              </>
            )}
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
};
```
{% endtab %}

{% tab title="main.tsx" %}
Wrap the app with our new provider

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { VeChainKitProviderWrapper } from "./components/VeChainKitProviderWrapper.tsx";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { lightTheme } from "./theme";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppProvider } from "./components/AppProvider.tsx";
import { SignatureVerificationWrapper } from "./components/SignatureVerificationWrapper.tsx";

(async () => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ChakraProvider theme={lightTheme}>
        <ColorModeScript initialColorMode="light" />
        <VeChainKitProviderWrapper>
          <SignatureVerificationWrapper>
              <AppProvider>
                <RouterProvider router={router} />
              </AppProvider>
          </SignatureVerificationWrapper>
        </VeChainKitProviderWrapper>
      </ChakraProvider>
    </React.StrictMode>,
  );
})();

```
{% endtab %}

{% tab title="useSignatureVerification.ts" %}
Handle the signature within a custom hook

```typescript
import { useWallet, useSignTypedData } from "@vechain/vechain-kit";
import { useState, useCallback } from "react";
import { ethers } from "ethers";

// EIP-712 typed data structure
const domain = {
  name: "MyAppName",
  version: "1",
};

const types = {
  Authentication: [
    { name: "user", type: "address" },
    { name: "timestamp", type: "string" },
  ],
};

export type SignatureVerificationValue = {
  user: string;
  timestamp: string;
};

export const useSignatureVerification = () => {
  const { account } = useWallet();
  const { signTypedData } = useSignTypedData();
  const [isVerifying, setIsVerifying] = useState(false);
  const [value, setValue] = useState<SignatureVerificationValue>({
    user: "",
    timestamp: "",
  });

  const signature = localStorage.getItem(`login_signature`);

  const verifySignature = useCallback(async () => {
    if (!account?.address || isVerifying) return;

    setValue({
      user: account.address,
      timestamp: new Date().toISOString(),
    });

    const existingSignature = localStorage.getItem(`login_signature`);
    if (existingSignature) return;

    setIsVerifying(true);
    try {
      const signature = await signTypedData({
        domain,
        types,
        message: value,
        primaryType: "Authentication",
      }, {
        signer: account?.address
      });

      const isValid = ethers.verifyTypedData(domain, types, value, signature);

      if (!isValid) {
        throw new Error("Signature verification failed");
      }

      localStorage.setItem(`login_signature`, signature);
    } catch (error) {
      console.error("Signature verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [account?.address, isVerifying, signTypedData, value]);

  const hasVerified = account?.address ? !!localStorage.getItem(`login_signature`) : false;

  return { hasVerified, isVerifying, signature, verifySignature, value };
};
```
{% endtab %}

{% tab title="Backend Validation" %}
On your backend validate the signature as follows:

```typescript
import {ethers} from "ethers";

static async verifySignature(signature: string, value: { user: string , timestamp: string }): Promise<string> {
    const domain = {
        name: "My App Name",
        version: "1",
    };

    const types = {
        Authentication: [
            {name: "user", type: "address"},
            {name: "timestamp", type: "string"},
        ],
    };

    return ethers.verifyTypedData(domain, types, value, signature);
}

const signerAddress = await verifySignature(
      signature,
      value
    );
    
if (signerAddress.toLowerCase() != address.toLowerCase()) {
    return {
        statusCode: 403,
        body: JSON.stringify({
        error: "Invalid signature",
        }),
    };
}

```
{% endtab %}
{% endtabs %}

{% hint style="danger" %}
You should **deprecate** this:

```typescript
import { useConnex } from '@vechain/vechain-kit';

export default function Home(): ReactElement {
    const connex = useConnex();

    const handleSignWithConnex = () => {
        connex.vendor.sign(    
            'cert',
            {
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: 'Please sign this message to connect your wallet.',
                },
            }
        ).request();
    }
    
    return <button onClick={handleSignWithConnex}> Sign </button>
}
```
{% endhint %}
