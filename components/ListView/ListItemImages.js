import React from "react";
import { FormattedMessage, defineMessages, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListToggle,
  DataListContent,
  DataListItemCells,
  Spinner,
} from "@patternfly/react-core";
import { BuilderImageIcon, CheckCircleIcon, ExclamationCircleIcon, PendingIcon } from "@patternfly/react-icons";
import { deletingCompose, cancellingCompose } from "../../core/actions/composes";
import {
  setModalStopBuildVisible,
  setModalStopBuildState,
  setModalDeleteImageVisible,
  setModalDeleteImageState,
} from "../../core/actions/modals";
import Logs from "../Logs/Logs";
import * as composer from "../../core/composer";
import ImagesDataList from "./ImagesDataList";
import ListItemUploads from "./ListItemUploads";
import DropdownKebab from "../Dropdown/DropdownKebab";

const messages = defineMessages({
  imageType: {
    defaultMessage: "Type",
    description: "A label for the type of image file was created",
  },
  imageCreated: {
    defaultMessage: "Created",
    description: "A label for the date that an image file was created",
  },
  imageSize: {
    defaultMessage: "Size",
    description: "A label for the size of an image file",
  },
  imageUploads: {
    defaultMessage: "Image uploads",
    description: "A label for the section that lists the upload actions initiated by the user",
  },
  imageActions: {
    defaultMessage: "Actions",
    description: "A label for the menu that displays the actions available",
  },
  imageLogs: {
    defaultMessage: "Logs",
    description: "Log content that gets generated as part of the image creation process",
  },
  imageStatusWaiting: {
    defaultMessage: "Image build pending",
    description: "Image build status when process is waiting",
  },
  imageStatusRunning: {
    defaultMessage: "Image build in progress",
    description: "Image build status when process is in progress",
  },
  imageStatusFinished: {
    defaultMessage: "Image build complete",
    description: "Image build status when process is finished",
  },
  imageStatusFailed: {
    defaultMessage: "Image build failed",
    description: "Image build status when process failed",
  },
  imageStatusStopping: {
    defaultMessage: "Stopping",
    description: "Image build status when user selected to end the process",
  },
});

class ListItemImages extends React.Component {
  constructor() {
    super();
    this.state = { logsExpanded: false, uploadsExpanded: false };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleShowModalStop = this.handleShowModalStop.bind(this);
    this.handleShowModalDeleteImage = this.handleShowModalDeleteImage.bind(this);
    this.handleLogsShow = this.handleLogsShow.bind(this);
    this.handleUploadsShow = this.handleUploadsShow.bind(this);
  }

  componentDidMount() {
    this.props.fetchingComposeTypes();
  }

  // maps to Remove button for FAILED
  handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.deletingCompose(this.props.listItem.id);
  }

  // maps to Stop button for WAITING
  handleCancel(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.cancellingCompose(this.props.listItem.id);
  }

  // maps to Stop button for RUNNING
  handleShowModalStop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.setModalStopBuildState(this.props.listItem.id, this.props.blueprint);
    this.props.setModalStopBuildVisible(true);
  }

  // maps to Delete button for FINISHED
  handleShowModalDeleteImage(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.setModalDeleteImageState(this.props.listItem.id, this.props.blueprint);
    this.props.setModalDeleteImageVisible(true);
  }

  handleLogsShow() {
    this.setState({ uploadsExpanded: false });
    this.setState((prevState) => ({ logsExpanded: !prevState.logsExpanded, fetchingLogs: !prevState.logsExpanded }));
    composer.getComposeLog(this.props.listItem.id).then(
      (logs) => {
        this.setState({ logsContent: logs, fetchingLogs: false });
      },
      () => {
        this.setState({
          logsContent: <FormattedMessage defaultMessage="No log available" />,
          fetchingLogs: false,
        });
      }
    );
  }

  // consider removing
  handleUploadsShow() {
    this.setState({ logsExpanded: false });
    this.setState((prevState) => ({ uploadsExpanded: !prevState.uploadsExpanded }));
  }

  render() {
    const { listItem, imageTypes } = this.props;
    const { formatMessage } = this.props.intl;
    const timestamp = new Date(listItem.job_created * 1000);
    const formattedTime = timestamp.toDateString();
    let actions;
    switch (listItem.queue_status) {
      case "FINISHED":
        actions = [
          <li key="download">
            <Button variant="plain" component="a" href={this.props.downloadUrl} data-download>
              <FormattedMessage defaultMessage="Download" />
            </Button>
          </li>,
          <li key="delete">
            <Button
              variant="plain"
              onClick={(e) => this.handleShowModalDeleteImage(e)}
              data-testid="delete-image"
              data-delete
            >
              <FormattedMessage defaultMessage="Delete" />
            </Button>
          </li>,
        ];
        break;
      case "RUNNING":
        actions = [
          <li key="stop">
            <Button variant="plain" onClick={(e) => this.handleShowModalStop(e)}>
              <FormattedMessage defaultMessage="Stop" />
            </Button>
          </li>,
        ];
        break;
      case "WAITING":
        actions = (
          <li key="stop">
            <Button variant="plain" onClick={(e) => this.handleCancel(e)}>
              <FormattedMessage defaultMessage="Stop" />
            </Button>
          </li>
        );
        break;
      case "FAILED":
        actions = [
          <li key="remove">
            <Button variant="plain" onClick={(e) => this.handleDelete(e)}>
              <FormattedMessage defaultMessage="Remove" />
            </Button>
          </li>,
        ];
        break;
      default:
        actions = undefined;
        break;
    }
    const logs = listItem.queue_status === "FAILED" || listItem.queue_status === "FINISHED";
    const logsButton = (
      <div aria-hidden={!logs} className={`pf-c-data-list__item-action ${logs ? "" : "cc-u-not-visible"}`}>
        <Button
          variant={`${this.state.logsExpanded ? "primary" : "secondary"}`}
          aria-expanded={this.state.logsExpanded}
          aria-controls={`${listItem.id}-logs`}
          onClick={this.handleLogsShow}
        >
          {formatMessage(messages.imageLogs)}
        </Button>
      </div>
    );
    const uploads = listItem.uploads !== undefined;
    const uploadsToggle = (
      <DataListToggle
        onClick={this.handleUploadsShow}
        isExpanded={this.state.uploadsExpanded}
        id="uploads-toggle"
        aria-label={`${formatMessage(messages.imageUploads)} ${this.props.blueprint}-${listItem.version}-${
          listItem.compose_type
        }`}
        aria-controls={`${listItem.id}-uploads`}
        // ^ need to fix this attribute value
        aria-hidden={!uploads}
        className={`${!uploads ? "cc-u-not-visible" : ""}`}
      />
    );

    const composeStatus = () => {
      switch (listItem.queue_status) {
        case "WAITING":
          return (
            <div className="cc-c-status">
              <div className="cc-c-status__icon">
                <PendingIcon className="pending-icon" />
              </div>
              {formatMessage(messages.imageStatusWaiting)}
            </div>
          );
        case "RUNNING":
          return (
            <div className="cc-c-status">
              <div className="cc-c-status__icon">
                <Spinner isSVG size="md" aria-label="Running status spinner" />
              </div>
              {formatMessage(messages.imageStatusRunning)}
            </div>
          );
        case "FINISHED":
          return (
            <div className="cc-c-status">
              <div className="cc-c-status__icon">
                <CheckCircleIcon className="success-icon" />
              </div>
              <span data-status>{formatMessage(messages.imageStatusFinished)}</span>
            </div>
          );
        case "FAILED":
          return (
            <div className="cc-c-status">
              <div className="cc-c-status__icon">
                <ExclamationCircleIcon className="error-icon" />
              </div>
              {formatMessage(messages.imageStatusFailed)}
            </div>
          );
        case "STOPPING":
          return (
            <div className="cc-c-status">
              <em className="text-muted cc-m-full-width">{formatMessage(messages.imageStatusStopping)}</em>
            </div>
          );
        default:
          return <></>;
      }
    };
    let logsSection;
    if (this.state.logsExpanded) {
      logsSection = <Logs logContent={this.state.logsContent} fetchingLog={this.state.fetchingLogs} />;
    }
    let uploadsSection;
    if (this.state.uploadsExpanded) {
      uploadsSection = (
        <ImagesDataList ariaLabel={formatMessage(messages.imageUploads)}>
          {listItem.uploads.map((upload) => (
            <ListItemUploads upload={upload} key={upload.uuid} />
          ))}
        </ImagesDataList>
      );
    }
    const gigabyte = 1024 * 1024 * 1024;
    const size = listItem.image_size / gigabyte;

    return (
      <DataListItem
        aria-labelledby={`${listItem.id}-compose-name`}
        isExpanded={this.state.uploadsExpanded}
        data-image={`${this.props.blueprint}-${listItem.version}-${listItem.compose_type}`}
      >
        <DataListItemRow>
          {uploadsToggle}
          <div className="cc-c-data-list__item-icon">
            <BuilderImageIcon />
          </div>
          <DataListItemCells
            className="cc-m-stacked cc-m-split-on-lg"
            dataListCells={[
              <DataListCell key="primary" className="pf-l-flex pf-m-column pf-m-space-items-xs">
                <div className="pf-l-flex__item">
                  <strong id={`${listItem.id}-compose-name`} data-image-name>
                    {this.props.blueprint}-{listItem.version}-{listItem.compose_type}
                  </strong>
                </div>
                <div className="pf-l-flex__item" data-testid="image-type">
                  <span>{formatMessage(messages.imageType)} </span>
                  <strong data-image-type={listItem.compose_type}>
                    {imageTypes.length > 0 ? imageTypes.find((type) => type.name === listItem.compose_type).label : ""}
                  </strong>
                </div>
                <div className="pf-l-flex__item">
                  <span>{formatMessage(messages.imageCreated)}</span> <strong>{formattedTime}</strong>
                </div>
                {listItem.queue_status === "FINISHED" && (
                  <div className="pf-l-flex__item" data-testid="image-size">
                    <span>{formatMessage(messages.imageSize)}</span> <strong>{size} GB</strong>
                  </div>
                )}
              </DataListCell>,
              <DataListCell key="status" data-testid="image-status">
                {composeStatus()}
              </DataListCell>,
            ]}
          />
          <div
            className={`pf-c-data-list__item-action ${actions === undefined ? "cc-u-not-visible" : ""}`}
            aria-hidden={actions === undefined}
          >
            <DropdownKebab dropdownItems={actions} />
          </div>
          {logsButton}
        </DataListItemRow>
        <DataListContent
          aria-label={formatMessage(messages.imageUploads)}
          id={`${listItem.id}-uploads`}
          isHidden={!this.state.uploadsExpanded}
          hasNoPadding
        >
          {uploadsSection}
        </DataListContent>
        <DataListContent
          aria-label={formatMessage(messages.imageLogs)}
          id={`${listItem.id}-logs`}
          isHidden={!this.state.logsExpanded}
          hasNoPadding
        >
          {logsSection}
        </DataListContent>
      </DataListItem>
    );
  }
}

ListItemImages.propTypes = {
  listItem: PropTypes.shape({
    blueprint: PropTypes.string,
    compose_type: PropTypes.string,
    id: PropTypes.string,
    image_size: PropTypes.number,
    job_created: PropTypes.number,
    job_finished: PropTypes.number,
    job_started: PropTypes.number,
    queue_status: PropTypes.string,
    version: PropTypes.string,
    uploads: PropTypes.arrayOf(PropTypes.object),
  }),
  blueprint: PropTypes.string,
  deletingCompose: PropTypes.func,
  cancellingCompose: PropTypes.func,
  fetchingComposeTypes: PropTypes.func,
  imageTypes: PropTypes.arrayOf(PropTypes.object),
  setModalStopBuildState: PropTypes.func,
  setModalStopBuildVisible: PropTypes.func,
  setModalDeleteImageState: PropTypes.func,
  setModalDeleteImageVisible: PropTypes.func,
  downloadUrl: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

ListItemImages.defaultProps = {
  listItem: {},
  blueprint: "",
  deletingCompose() {},
  cancellingCompose() {},
  fetchingComposeTypes() {},
  imageTypes: [],
  setModalStopBuildState() {},
  setModalStopBuildVisible() {},
  setModalDeleteImageState() {},
  setModalDeleteImageVisible() {},
  downloadUrl: "",
};

const mapDispatchToProps = (dispatch) => ({
  deletingCompose: (compose) => {
    dispatch(deletingCompose(compose));
  },
  cancellingCompose: (compose) => {
    dispatch(cancellingCompose(compose));
  },
  setModalStopBuildState: (composeId, blueprintName) => {
    dispatch(setModalStopBuildState(composeId, blueprintName));
  },
  setModalStopBuildVisible: (visible) => {
    dispatch(setModalStopBuildVisible(visible));
  },
  setModalDeleteImageState: (composeId, blueprintName) => {
    dispatch(setModalDeleteImageState(composeId, blueprintName));
  },
  setModalDeleteImageVisible: (visible) => {
    dispatch(setModalDeleteImageVisible(visible));
  },
});

export default connect(null, mapDispatchToProps)(injectIntl(ListItemImages));
