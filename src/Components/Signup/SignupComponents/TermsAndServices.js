import React from "react";
import { Modal, Button, Typography } from "antd";
import styled from "styled-components";

const CustomModal = styled(Modal)`
  .ant-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ant-modal-title {
    font-size: 20px !important;
  }
  .ant-modal-content {
    height: 640px;
    overflow-y: auto;
  }
`;

const { Title, Paragraph } = Typography;

const TermsAndServicesModal = ({ setIsModalVisible, isModalVisible }) => {

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <CustomModal
        title="Terms of Service for Vita Guide AI"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        width={860}
      >
        <Typography>
          <Paragraph>
            These Terms of Service ("Terms") govern your access to and use of the Vita Guide AI platform ("Platform"), provided by Vita Guide AI ("Company," "we," "us," or "our"). By accessing or using the Platform, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any part of these Terms, you are prohibited from using or accessing this Platform.
          </Paragraph>

          <Title level={4}>1. Services Provided</Title>
          <Paragraph>
            The Platform offers AI-driven tools and insights to assist health professionals in managing and improving client health outcomes. Services include but are not limited to, AI research assistance, personalized client education materials, functional test analysis, and therapeutic diet recommendations.
          </Paragraph>

          <Title level={4}>2. Registration and Account Integrity</Title>
          <Paragraph>
            <strong>Account Creation:</strong> You must register for an account to use the Platform. By registering, you agree to provide accurate, current, and complete information about yourself.<br />
            <strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
          </Paragraph>

          <Title level={4}>3. Use Restrictions</Title>
          <Paragraph>
            <strong>Lawful Use:</strong> You agree to use the Platform only for lawful purposes and in compliance with these Terms.<br />
            <strong>Prohibited Activities:</strong> You are prohibited from using the Platform to collect sensitive personal information without consent, infringe on intellectual property rights, or conduct any activity that is illegal or infringes on the rights of others.
          </Paragraph>

          <Title level={4}>4. Intellectual Property</Title>
          <Paragraph>
            All content, features, and functionality on the Platform, including text, graphics, logos, icons, images, and software, are the property of Vita Guide AI or its licensors and are protected by international copyright and trademark laws.
          </Paragraph>

          <Title level={4}>5. Privacy Policy</Title>
          <Paragraph>
            Your use of the Platform is also governed by the Vita Guide AI Privacy Policy, which outlines our practices concerning the handling of personal information.
          </Paragraph>

          <Title level={4}>6. Disclaimer of Warranties</Title>
          <Paragraph>
            The Platform is provided on an "as is" and "as available" basis. Vita Guide AI expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </Paragraph>

          <Title level={4}>7. Limitation of Liability</Title>
          <Paragraph>
            Vita Guide AI will not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from your use or inability to use the services provided on the Platform.
          </Paragraph>

          <Title level={4}>8. Modification of Terms</Title>
          <Paragraph>
            We reserve the right to modify these Terms at any time. Your continued use of the Platform following the posting of changes will mean that you accept and agree to the changes.
          </Paragraph>

          <Title level={4}>9. Termination</Title>
          <Paragraph>
            We may terminate or suspend your access to the Platform immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms.
          </Paragraph>

          <Title level={4}>10. Governing Law</Title>
          <Paragraph>
            These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction] without regard to its conflict of law provisions.
          </Paragraph>

          <Title level={4}>11. Contact Information</Title>
          <Paragraph>
            If you have any questions about these Terms, please contact us at contact@vitaguide.health.
          </Paragraph>

          <Title level={4}>Acceptance of Terms</Title>
          <Paragraph>
            By using this Platform, you signify your acceptance of these Terms and agree to abide by them.
          </Paragraph>
        </Typography>
      </CustomModal>
    </>
  );
};

export default TermsAndServicesModal;
