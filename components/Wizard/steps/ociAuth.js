import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  ociTitle: {
    id: "wizard.oci.title",
    defaultMessage: "Upload to OCI",
  },
  userOCIDPopoverBody: {
    id: "wizard.oci.userOCID.popoverBody",
    defaultMessage:
      "You can find your user OCID <strong>Identity and Access Management (IAM)</strong> page in the OCI console.",
  },
  userOCIDPopoverAria: {
    id: "wizard.oci.userOCID.popoverAria",
    defaultMessage: "User ocid help",
  },
  privateKeyPopoverBody: {
    id: "wizard.oci.privateKey.popoverBody",
    defaultMessage:
      "You can view your deployed RSA keys in the API Keys section on the <strong>Identity and Access Management (IAM)</strong> page in the OCI console.",
  },
  privateKeyPopoverAria: {
    id: "wizard.oci.privateKey.popoverAria",
    defaultMessage: "Private key help",
  },
  fingerprintPopoverBody: {
    id: "wizard.oci.fingerprint.popoverBody",
    defaultMessage:
      "You can view your deployed RSA keys fingerprint in the API Keys section on the <strong>Identity and Access Management (IAM)</strong> page in the OCI console.",
  },
  fingerprintPopoverAria: {
    id: "wizard.oci.fingerprint.popoverAria",
    defaultMessage: "Fingerprint help",
  },
});

const ociAuth = () => {
  const intl = useIntl();
  return {
    title: <FormattedMessage id="wizard.oci.authTitle" defaultMessage="Authentication" />,
    name: "oci-auth",
    substepOf: intl.formatMessage(messages.ociTitle),
    nextStep: "oci-dest",
    fields: [
      {
        component: "text-field-custom",
        name: "oci-user-ocid",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage id="wizard.oci.userOCID.label" defaultMessage="User OCID" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.userOCIDPopoverBody, {
              strong: (str) => <strong>{str}</strong>,
            })}
            aria-label={intl.formatMessage(messages.userOCIDPopoverAria)}
          >
            <Button variant="plain" aria-label={intl.formatMessage(messages.userOCIDPopoverAria)}>
              <HelpIcon />
            </Button>
          </Popover>
        ),
        isRequired: true,
        autoFocus: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: "upload-file",
        name: "oci-private-key",
        label: <FormattedMessage id="wizard.oci.privateKey.label" defaultMessage="Private key" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.privateKeyPopoverBody, {
              strong: (str) => <strong>{str}</strong>,
            })}
            aria-label={intl.formatMessage(messages.privateKeyPopoverAria)}
          >
            <Button variant="plain" aria-label={intl.formatMessage(messages.privateKeyPopoverAria)}>
              <HelpIcon />
            </Button>
          </Popover>
        ),
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: "text-field",
        name: "oci-private-key-filename",
        hideField: true,
      },
      {
        component: "text-field-custom",
        name: "oci-fingerprint",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage id="wizard.oci.fingerprint.label" defaultMessage="Fingerprint" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.fingerprintPopoverBody, {
              strong: (str) => <strong>{str}</strong>,
            })}
            aria-label={intl.formatMessage(messages.fingerprintPopoverAria)}
          >
            <Button variant="plain" aria-label={intl.formatMessage(messages.fingerprintPopoverAria)}>
              <HelpIcon />
            </Button>
          </Popover>
        ),
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
    ],
  };
};

export default ociAuth;
