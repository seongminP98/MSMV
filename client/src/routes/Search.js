import React, {useState} from 'react';
import axios from 'axios';
import SearchPresenter from './Presenters/SearchPresenter';
import swal from "@sweetalert/with-react";

const Search = () => {
  const [searchCrit, setSearchCrit] = useState("title");
  const [searchContent, setSearchContent] = useState('');
  let [result, setResult] = useState([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const props = {searchContent, result, currentSearch};

  const submitSearch = async (e) => {
    if (e.key === "Enter") {
      if (searchContent === '') { // 아무것도 입력하지 않을 시
        setCurrentSearch(searchContent);
        return; // 아무것도 반환하지 않음
      }

      if (searchCrit === "title") {
        const check = 1;
        const movieNm = searchContent;
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/search`, { check, movieNm })
        .then((response) => {
          if (response.status === 204)
            setResult([]);
          else
            setResult(response.data.result);
        })
        .catch((error) => {
          swal(error.response.data.message);
        });
      }
      else if (searchCrit === "director") {
        const check = 2;
        const dirNm = searchContent;
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/search`, { check, dirNm })
        .then((response) => {
          if (response.status === 204)
            setResult([]);
          else
            setResult(response.data.result);
        })
        .catch((error) => {
          swal(error.response.data.message);
        });
      }
      //result.sort((a, b) => a.rate < b.rate);
      setCurrentSearch(searchContent);
    }
  }
  
  const takeInput = (e) => {
    setSearchContent(e.target.value);
  }

  const SearchCritCheck = (e) => {
    setSearchCrit(e.target.value);
  };

  return ( 
    <SearchPresenter searchCritCheck={SearchCritCheck} searchCrit={searchCrit} submitSearch={submitSearch} takeInput={takeInput} {...props}/>
  )
}

export default Search;