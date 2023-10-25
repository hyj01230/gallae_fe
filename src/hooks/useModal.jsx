import { useState } from "react";

export default function useModal() {
  const [isModal, setIsModal] = useState(false);

  const handleOpenModal = () => {
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  return { isModal, handleOpenModal, handleCloseModal };
}
