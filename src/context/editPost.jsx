import { createContext, useState } from "react";

const editContext = createContext();

export function EditPostsProvider({ children }) {
  const [editPost, setEditPost] = useState(null);

  return (
    <editContext.Provider value={{ editPost, setEditPost }}>
      {children}
    </editContext.Provider>
  );
}

export default editContext;
