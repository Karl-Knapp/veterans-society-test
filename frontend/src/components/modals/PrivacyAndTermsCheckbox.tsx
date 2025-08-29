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
    agreedToDisclosures: boolean;
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
        name="agreedToDisclosures"
        isChecked={formData.agreedToDisclosures}
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
          <ModalBody>We collect personal data from our users solely for the purpose of providing assistance to veterans. We do not share this data with any third parties. We take the privacy of our users' data very seriously and have implemented appropriate measures to protect it. If you have any questions, please feel free to contact us.</ModalBody>
        </ModalContent>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal isOpen={isTermsOpen} onClose={onTermsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms of Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>The information provided on this website is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on website for any purpose. Any reliance you place on such information is strictly at your own risk In no event will be liable for any loss or damage including without limitation, indirect consequential loss or damage, or any loss or damage whatsoever arising from of data or profits arising of, or in with, the use of this website.</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PrivacyAndTermsCheckbox;
