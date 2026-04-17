import { useQueryState, parseAsBoolean } from "nuqs";

const useForgotPasswordDialog = () => {
  const [open, setOpen] = useQueryState(
    "forgot-password",
    parseAsBoolean.withDefault(false),
  );

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return { open, onOpen, onClose };
};

export default useForgotPasswordDialog;
