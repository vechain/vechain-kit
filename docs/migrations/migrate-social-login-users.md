# Migrate Social Login Users

If you have an app with some custom login (eg: login with email, login with google, etc.) and you want to use this kit and migrate your users you will need to:

* Create your Privy app
* Manually add your users or use Privy's APIs

<figure><img src="../../.gitbook/assets/image (1) (1) (1).png" alt=""><figcaption><p>Privy/YourApp/Users/All Users/Add</p></figcaption></figure>

Please refer to this documentation to import users through Privy APIs: [https://docs.privy.io/reference/sdk/server-auth/classes/PrivyClient#importuser](https://docs.privy.io/reference/sdk/server-auth/classes/PrivyClient#importuser)

3\) Toggle the "Pregenerate EVM Wallet" so an embedded wallet will be created and associated to the user.

4\) If your users where logging in with social you may need to ask them to associate that social login method after they login first time with their email.
