# Text Records (avatar & co.)

With every name come a set of records. These records are key value pairs that can be used to store information about the profile. Think of this as a user's **digital backpack**. Utalized for storage of preferences, public details, and more.

<figure><img src="../.gitbook/assets/image (7).png" alt="" width="322"><figcaption></figcaption></figure>

### Types of Records

Here are some of the most commonly used records:

| Name        | Usage                                                                | Reference                                     | Example                                     |
| ----------- | -------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| display     | Preferred capitalization                                             | [ENSIP-5](https://docs.ens.domains/ensip/5)   | Luc.eth                                     |
| avatar      | Avatar or logo (see [Avatars](https://docs.ens.domains/web/avatars)) | [ENSIP-5](https://docs.ens.domains/ensip/5)   | ipfs://dQw4w9WgXcQ                          |
| description | Description of the name                                              | [ENSIP-5](https://docs.ens.domains/ensip/5)   | DevRel @ ENS Labs                           |
| keywords    | List of comma-separated keywords                                     | [ENSIP-5](https://docs.ens.domains/ensip/5)   | person, ens                                 |
| email       | Email address                                                        | [ENSIP-5](https://docs.ens.domains/ensip/5)   | [luc@ens.domains](mailto:luc@ens.domains)   |
| mail        | Physical mailing address                                             | [ENSIP-5](https://docs.ens.domains/ensip/5)   | V3X HQ                                      |
| notice      | Notice regarding this name                                           | [ENSIP-5](https://docs.ens.domains/ensip/5)   | This is a notice                            |
| location    | Generic location (e.g. "Toronto, Canada")                            | [ENSIP-5](https://docs.ens.domains/ensip/5)   | Breda, NL                                   |
| phone       | Phone number as an E.164 string                                      | [ENSIP-5](https://docs.ens.domains/ensip/5)   | +1 234 567 890                              |
| url         | Website URL                                                          | [ENSIP-5](https://docs.ens.domains/ensip/5)   | [https://ens.domains](https://ens.domains/) |
| header      | Image URL to be used as a header/banner                              | [ENSIP-18](https://docs.ens.domains/ensip/18) | ipfs://dQw4w9WgXcQ                          |

### Other Records

Currently there are a few records that have been standardised. However you are welcome to store any key value pair you desire. We generally recommend to stick to a pattern, or prefix things with your app or protocol (eg. `com.discord`, or `org.reddit`), as such to avoid collisions.

### Header/Banner Record <a href="#header-banner-record" id="header-banner-record"></a>

One of the newer standardised records is the "header" record. This header record, similar to the avatar record, accepts any IPFS, Arweave, EIP155, or regular URL to an image resource. The image is then displayed as a banner on the profile page and tends to be in a 1:3 aspect ratio.

### Setting Records <a href="#setting-records" id="setting-records"></a>

When records are loaded they are loaded from the resolver responsible for the name. As resolvers are user controlled, we cannot guarantee a write function is available. This makes it a more in-depth process to update a users records.

{% hint style="info" %}
This is protocol build by ENS domains and supported by veDelegate. Follow [ENS documentation ](https://docs.ens.domains/web/records)for more information.
{% endhint %}

## Keep reading how to integrate with the VeChain Kit

{% content-ref url="vetdomains.md" %}
[vetdomains.md](vetdomains.md)
{% endcontent-ref %}

{% content-ref url="/broken/pages/7CHe0v8VZqBxzugUu9Rr" %}
[Broken link](/broken/pages/7CHe0v8VZqBxzugUu9Rr)
{% endcontent-ref %}
