// ModalContextProvider.jsx
import React, { createContext, useCallback, useState } from "react";
import { OpenModal } from "../lib/definitions";
import EditCategoryModal, { EditCategoryModalProps } from "../components/modals/EditCategoryModal";
import CreateCategoryModal, { CreateCategoryModalProps } from "../components/modals/CreateCategoryModal";
import DeleteCategoryModal, { DeleteCategoryModalProps } from "../components/modals/DeleteCategoryModal";
import CreateMenuModal, { CreateMenuModalProps } from "../components/modals/CreateMenuModal";
import DeleteMenuModal, { DeleteMenuModalProps } from "../components/modals/DeleteMenuModal";
import EditMenuModal, { EditMenuModalProps } from "../components/modals/EditMenuModal";

interface IModalContext {
  openCreateCategoryModal: OpenModal<CreateCategoryModalProps>;
  openEditCategoryModal: OpenModal<EditCategoryModalProps>;
  openDeleteCategoryModal: OpenModal<DeleteCategoryModalProps>;
  
  openCreateMenuModal: OpenModal<CreateMenuModalProps>;
  openEditMenuModal: OpenModal<EditMenuModalProps>;
  openDeleteMenuModal: OpenModal<DeleteMenuModalProps>;
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

  const {
    openModal: openCreateMenuModal,
    closeModal: closeCreateMenuModal,
    visible: createMenuModalVisible,
    props: createMenuModalProps,
  } = useDefaultModalLogic<CreateMenuModalProps>();

  const {
    openModal: openEditMenuModal,
    closeModal: closeEditMenuModal,
    visible: editMenuModalVisible,
    props: editMenuModalProps,
  } = useDefaultModalLogic<EditMenuModalProps>();

  const {
    openModal: openDeleteMenuModal,
    closeModal: closeDeleteMenuModal,
    visible: deleteMenuModalVisible,
    props: deleteMenuModalProps
  } = useDefaultModalLogic<DeleteMenuModalProps>();

  const modalContextValue: IModalContext = {
    openCreateCategoryModal,
    openEditCategoryModal,
    openDeleteCategoryModal,

    openCreateMenuModal,
    openEditMenuModal,
    openDeleteMenuModal
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

      { createMenuModalProps && (
        <CreateMenuModal
          {...createMenuModalProps}
          onClose={closeCreateMenuModal}
          visible={createMenuModalVisible}
        />
      )}

      { editMenuModalProps && (
        <EditMenuModal
          {...editMenuModalProps}
          onClose={closeEditMenuModal}
          visible={editMenuModalVisible}
        />
      )}

      { deleteMenuModalProps && (
        <DeleteMenuModal
          {...deleteMenuModalProps}
          onClose={closeDeleteMenuModal}
          visible={deleteMenuModalVisible}
        />
      )}

      {children}
    </ModalContext.Provider>
  );
};