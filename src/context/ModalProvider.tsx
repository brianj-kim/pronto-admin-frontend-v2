// ModalContextProvider.jsx
import React, { createContext, useCallback, useState } from "react";
import { OpenModal } from "../lib/definitions";
import EditCategoryModal, { EditCategoryModalProps } from "../components/modals/EditCategoryModal";
import CreateCategoryModal, { CreateCategoryModalProps } from "../components/modals/CreateCategoryModal";
import DeleteCategoryModal, { DeleteCategoryModalProps } from "../components/modals/DeleteCategoryModal";

interface IModalContext {
  openCreateCategoryModal: OpenModal<CreateCategoryModalProps>;
  openEditCategoryModal: OpenModal<EditCategoryModalProps>;
  openDeleteCategoryModal: OpenModal<DeleteCategoryModalProps>;
}

export const ModalContext = createContext<IModalContext>({} as IModalContext);

const useDefaultModalLogic = <T,>() => {
  const [visible, setVisible] = useState<boolean>(false);
  const [props, setProps] = useState<T | undefined>();

  const openModal = useCallback((props?: T) => {
    setProps(props);
    setVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setProps(undefined);
    setVisible(false);
  }, []);

  return {
    visible,
    props,
    openModal,
    closeModal
  };
};

// export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const {
    openModal: openCreateCategoryModal,
    closeModal: closeCreateCategoryModal,
    visible: createCategoryModalVisible,
    props: createCategoryModalProps,
  } = useDefaultModalLogic<CreateCategoryModalProps>();

  const {
    openModal: openEditCategoryModal,
    closeModal: closeEditCategoryModal,
    visible: editCategoryModalVisible,
    props: editCategoryModalProps,
  } = useDefaultModalLogic<EditCategoryModalProps>();

  const {
    openModal: openDeleteCategoryModal,
    closeModal: closeDeleteCategoryModal,
    visible: deleteCategoryModalVisible,
    props: deleteCategoryModalProps
  } = useDefaultModalLogic<DeleteCategoryModalProps>();

  const modalContextValue: IModalContext = {
    openCreateCategoryModal,
    openEditCategoryModal,
    openDeleteCategoryModal
  };

  return (
    <ModalContext.Provider value={modalContextValue}>
      {createCategoryModalProps && (
        <CreateCategoryModal
          {...createCategoryModalProps}
          onClose={closeCreateCategoryModal}
          visible={createCategoryModalVisible}
        />
      )}

      {editCategoryModalProps && (
        <EditCategoryModal
          {...editCategoryModalProps}
          onClose={closeEditCategoryModal}
          visible={editCategoryModalVisible}
        />
      )}

      { deleteCategoryModalProps && (
        <DeleteCategoryModal
          {...deleteCategoryModalProps}
          onClose={closeDeleteCategoryModal}
          visible={deleteCategoryModalVisible}
        />
      )}

      {children}
    </ModalContext.Provider>
  );
};