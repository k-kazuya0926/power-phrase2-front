import createAxios from "./createAxios.js";

export default async function uploadFile(file) {
  if (file == null) {
    return null
  }

  const data = new FormData();
  data.append('ImageFile', file);
  var axios = createAxios();
  const res = await axios.post('/users/images', data);

  return res.data
}
