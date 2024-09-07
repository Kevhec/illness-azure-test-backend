import { BlobServiceClient, StorageSharedKeyCredential, ContainerSASPermissions, generateBlobSASQueryParameters } from "@azure/storage-blob";
import dotenv from 'dotenv'

dotenv.config();

const accountName = process.env.AZURE_BLOB_NAME;
const accountKey = process.env.AZURE_BLOB_KEY;
const containerName = 'plantstorage'

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

/* const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
); */

function generateContainerSasTokenURL() {
  const permissions = new ContainerSASPermissions();
  permissions.write = true;
  permissions.create = true;
  permissions.add = true;

  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 10);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      permissions,
      expiresOn: expiryTime,
    },
    sharedKeyCredential
  ).toString();

  const sasURL = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`

  return sasURL;
}

export default generateContainerSasTokenURL;
