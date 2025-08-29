import {
  Checkbox,
  Text,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

interface Props {
  formData: {
    agreedToPrivacyPolicy: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textColor: string;
}

function PrivacyAndTermsCheckbox({ formData, handleInputChange, textColor }: Props) {
  const {
    isOpen: isPrivacyOpen,
    onOpen: onPrivacyOpen,
    onClose: onPrivacyClose,
  } = useDisclosure();

  const {
    isOpen: isTermsOpen,
    onOpen: onTermsOpen,
    onClose: onTermsClose,
  } = useDisclosure();

  return (
    <>
      <Checkbox
        name="agreedToPrivacyPolicy"
        isChecked={formData.agreedToPrivacyPolicy}
        onChange={handleInputChange}
        colorScheme="gray"
      >
        <Text color={textColor}>
          I agree to the{" "}
          <Link color="blue.400" onClick={(e) => { e.stopPropagation(); onPrivacyOpen(); }}>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link color="blue.400" onClick={(e) => { e.stopPropagation(); onTermsOpen(); }}>
            Terms of Service
          </Link>
          .
        </Text>
      </Checkbox>

      {/* Privacy Policy Modal */}
      <Modal isOpen={isPrivacyOpen} onClose={onPrivacyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Privacy Policy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>BANG1</ModalBody>
        </ModalContent>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal isOpen={isTermsOpen} onClose={onTermsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms of Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>BANG2</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PrivacyAndTermsCheckbox;
