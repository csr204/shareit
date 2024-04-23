import { useRef, useState } from "react";
import "./App.css";
import logo from "./assets/file.svg";
import postFile from "./postfile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sendEmail from "./sendMail";

function App() {
  const inputref = useRef();
  const cpyValue = useRef();
  const emailFromRef = useRef();
  const emailToRef = useRef();
  const [url, setUrl] = useState(null);
  const clickHandler = () => {
    // let inputFile = document.querySelector(".inputFile");
    // inputFile.click();
    inputref.current.click();
  };

  const uploadFile = async (file) => {
    // console.log(e.target.files[0]);
    //post file
    const url = await postFile(file);
    //set url
    setUrl(url);
    //show url on screen
    console.log(url);
  };
  const changeHandler = (e) => {
    uploadFile(e.target.files[0]);
  };
  const dragHandler = (e) => {
    e.preventDefault();
  };
  const dropHandler = (e) => {
    e.preventDefault();
    uploadFile(e.dataTransfer.files[0]);
  };
  const copyHandler = () => {
    const urlCopy = cpyValue.current.textContent;
    //console.log(urlCopy);
    //1)document.execCommand('copy') is designed to work with text input elements and text areas. Using it directly on a <p>/<span> element won't work as expected because it's not an input element
    //2)so it is required to create a temp input elem
    const tempInput = document.createElement("input");
    //setting input's value to text that is supposed to be copied here it is url
    tempInput.value = urlCopy;
    //3)by default doesn't insert the created elem into DOM so we have to use appendChild method
    document.body.appendChild(tempInput);
    //selecting the input elem
    tempInput.select();
    document.execCommand("copy");
    //value is copied ,now remove the appended input
    document.body.removeChild(tempInput);
    //showing "message" (toast) using react-toastify package <ToastContainer/> is required to render/show our toast on screen
    toast.success("link has been copied to the clipboard!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };
  //todo (error handling) and mail(frontend)
  const emailHandler = async () => {
    const sender = emailFromRef.current.value;
    const reciever = emailToRef.current.value;
    //for uuid
    const substr = url.split("/");
    const uuid = substr[substr.length - 1];
    console.log(uuid);
    const emailDetails = {
      emailFrom: sender,
      emailTo: reciever,
      uuid,
    };
    try {
      const message = await sendEmail(emailDetails);
      if (message === "successfully sent") {
        toast.success(message, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        //implement fail
        toast.error(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } catch (err) {
      console.log(err);
    }
    emailFromRef.current.value = "";
    emailToRef.current.value = "";
  };
  return (
    <>
      {/* <header>
        <div className="buttons">
          <button>signup</button>
          <button>login</button>
        </div>
        <div className="github">
          <i className="ri-github-fill"></i>
        </div>
      </header> */}
      <section className="wrapper">
        <div className="upload-box">
          <div className="drop" onDrop={dropHandler} onDragOver={dragHandler}>
            <img src={logo} alt="upload" draggable="false" className="center" />
            <input
              ref={inputref}
              type="file"
              className="inputFile"
              name="myfile"
              onChange={changeHandler}
            />
            <p>
              Drop Your Files here..or{" "}
              <span id="browse" onClick={clickHandler}>
                Browse
              </span>
            </p>
          </div>
          {url && (
            <div className="extras">
              <div className="url-holder">
                <span className="url" ref={cpyValue}>
                  {url}
                </span>
                <i className="ri-clipboard-fill" onClick={copyHandler}></i>
              </div>
              <div className="email">
                <h1>or send through email</h1>
                <label>From</label>
                <input type="email" ref={emailFromRef} />
                <label>to</label>
                <input type="email" ref={emailToRef} />
                <button id="emailSend" onClick={emailHandler}>
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        <ToastContainer />
      </section>
    </>
  );
}

export default App;
