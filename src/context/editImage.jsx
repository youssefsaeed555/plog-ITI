import { createContext, useState } from "react";

const editPhotoContext = createContext();

export function EditPhotoProvider({ children }) {
  const [editPhoto, setEditPhoto] = useState(null);

  return (
    <editPhotoContext.Provider value={{ editPhoto, setEditPhoto }}>
      {children}
    </editPhotoContext.Provider>
  );
}

export default editPhotoContext;
