import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.COMP_VISION_ENDPOINT
const key = process.env.COMP_VISION_KEY
const modelName = process.env.COMP_VISION_MODELNAME

const customModelEndpoint = `${endpoint}/computervision/imageanalysis:analyze?model-name=${modelName}&api-version=2023-04-01-preview`

const testImgUrl = 'https://storage.googleapis.com/kagglesdsdata/datasets/1447507/2394131/Train/Train/Rust/a01a8fe2f81f99f0.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20240829%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240829T223627Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=849fb8153a4966e97c62bbda7abe0297ae3a04f23f5baba3432cd84db620771135801f03ea83e2a0e64aa58fba7dd6153e9f4799e520487a8fe6876fd6ecbee117e98ceff732832af8c5dc25bf9cb27e0ded5237433776e01ab58754e00cbac3ef335ef7468308865d3402b1878bed1fdf82cf673841f20545bb0eec1daf8fee61ec66899e5b1ce8d6bb6830558e8a092d8b849a71442657ad8ca4627b59f9c89004cf30521ad93aeb733c1e4841764b6fa0748bec07d0a8c84b986964d5a982bdc0b43a87a6118ba30437957978aee19fdf5a8e08347f6f1ed4f3f0e31e4080f05cfb01e5409c0b57f920e1e56420e36699560f1ab019214d6a138107feb827';

async function analyzeImage(imgUrl = testImgUrl) {
  try {
    const response = await axios.post(
      customModelEndpoint,
      {
        url: imgUrl
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": key,
        }
      }
    )

    const results = response.data;

    console.log("Model version: ", results.modelVersion)
    console.log("Metadata: ", results.metadata)

    const { customModelResult } = results

    if (customModelResult?.tagsResult) {
      const { values } = customModelResult.tagsResult;

      return values;
    } else {
      console.log("No results where retrieved.")
    }

    return {};
  } catch (error) {
    console.log(error)
  }
}

export default analyzeImage;
