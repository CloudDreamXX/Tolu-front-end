import Header from "../../components/layout/Header";
import { useGetSessionResultQuery, useGetUserProfileQuery } from "../../redux/apis/apiSlice";
import LibraryInput from "../user/library/components/LibraryInput";
const Home = () => {
  const { data } = useGetUserProfileQuery()
  // const { data: setChats } = useGetSearchHistoryQuery()
  const { data: section } = useGetSessionResultQuery()
  // console.log("data", data);
  // console.log("setChats", setChats);
  // console.log("section", section);
  const handleSubmitValue = (value) => {
    alert(`Submitted Value: ${value}`);
  };

  const handleFileUpload = (file) => {
    console.log("Uploaded File:", file.name);
    alert(`File Uploaded: ${file.name}`);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };


  return (
    <div className="w-full h-screen flex flex-col items-center justify-center ">
      <Header />
      <section className="flex w-[60%] h-screen items-center justify-center">

        <LibraryInput
          placeholder="Ask anything..."
          onChangeValue={handleInputChange}
          onSubmitValue={handleSubmitValue}
          onFileUpload={handleFileUpload}
        />
      </section>
    </div>
  );
};

export default Home;
