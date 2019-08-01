# MSI Local

Service to emulate the Azure Managed Service Identity Service locally for local development

To use, in the source of the project you're running it from add msilocal.json in the root of your project with following schema

```json
{
    "clientId": "<client-id>",
    "clientSecret": "<client-secret>",
    "authURL": "https://login.microsoftonline.com/<tenant-id>/oauth2/token"
}
```

Follow the instructions here [https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to get the client id, client secret, and tenant id
