"use client";
import AddEditForm from "@/components/add-edit-form";
import AppContainer from "@/layout/app-container";
 



const AddPostView = () => {
    return (
    <>
      <AppContainer title="Add Post">
        <AddEditForm />
      </AppContainer>
    </>
  );
};

export default AddPostView;
