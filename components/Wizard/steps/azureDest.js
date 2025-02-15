import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  azureStepsTitle: {
    id: "wizard.azure.title",
    defaultMessage: "Upload to Azure",
  },
  imageNamePopoverBody: {
    id: "wizard.azure.imageName.popoverBody",
    defaultMessage: "Provide a file name to be used for the image file that will be uploaded.",
  },
  imageNamePopoverAria: {
    id: "wizard.azure.imageName.popoverAria",
    defaultMessage: "Image name help",
  },
  storageContainerPopoverBody: {
    id: "wizard.azure.storageContainer.popoverBody",
    defaultMessage:
      "Provide the Blob container to which the image file will be uploaded. You can find containers under the " +
      "<strong>Blob service</strong> section of a storage account. You can find storage accounts on the " +
      "<strong>Storage accounts</strong> page in the Azure portal.",
  },
  storageContainerPopoverAria: {
    id: "wizard.azure.storageContainer.popoverAria",
    defaultMessage: "Storage container help",
  },
});

const azureDest = () => {
  const intl = useIntl();
  return {
    title: <FormattedMessage id="wizard.azure.destTitle" defaultMessage="Destination" />,
    name: "azure-dest",
    substepOf: intl.formatMessage(messages.azureStepsTitle),
    nextStep: "system",
    fields: [
      {
        component: "text-field-custom",
        name: "azure-image-name",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage id="wizard.azure.imageName.label" defaultMessage="Image name" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.imageNamePopoverBody)}
            aria-label={intl.formatMessage(messages.imageNamePopoverAria)}
          >
            <Button variant="plain" aria-label={intl.formatMessage(messages.imageNamePopoverAria)}>
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
        component: "text-field-custom",
        name: "azure-storage-container",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage id="wizard.azure.storageContainer.label" defaultMessage="Storage container" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.storageContainerPopoverBody, {
              strong: (str) => <strong>{str}</strong>,
            })}
            aria-label="Storage container help"
          >
            <Button variant="plain" aria-label={intl.formatMessage(messages.storageContainerPopoverAria)}>
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

export default azureDest;
