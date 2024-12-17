import { useMutation } from "react-query";
import toast from "react-hot-toast";
import React, { Dispatch, SetStateAction } from "react";
import { setGlobalLoading } from "@/states/slices/authReducer";
export const useHandleToggle = (
  api: any,
  setStateAction: Dispatch<SetStateAction<boolean | string>>,
  dispatch: any
) => {
  const apimutation = useMutation(api);

  const handleAction = async (data: any) => {
    dispatch(setGlobalLoading(true));
    try {
      const res: any = await apimutation.mutateAsync(data);
      if (res) {
        setStateAction(data); // Update the state with the new data
        toast.success(res?.message);
        dispatch(setGlobalLoading(false));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      dispatch(setGlobalLoading(false));
    } finally {
      dispatch(setGlobalLoading(false));
    }
  };

  return { handleAction };
};
