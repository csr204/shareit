const host = "http://localhost:3000/";
const uploadURL = host + "api/file";

const postFile = async (paramFile) => {
  //converting it into formData
  const file = new FormData();
  file.append("myfile", paramFile);
  const request = await fetch(uploadURL, {
    method: "POST",
    mode: "cors",
    body: file,
  });
  const response = await request.json();
  // console.log(response);
  return response.url;
};
export default postFile;
