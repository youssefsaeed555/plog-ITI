import { useEffect, useState } from "react";

export default function useGuard() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("user"));
  let [logged, setLogged] = useState(!!authToken);
  useEffect(() => {
    //if falsy value setLogged = false
    //if token setLogged = true
    setLogged(!!authToken);
  }, [authToken]);
  //rerender based on change logged state
  return [authToken, userId, logged];
}
