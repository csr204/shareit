const sendEmail = async (details) => {
  console.log(details);
  const request = await fetch("http://localhost:3000/api/file/send", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
  const response = await request.json();
  console.log(response);
  console.log(response.message);
  return response.message;
};
export default sendEmail;
