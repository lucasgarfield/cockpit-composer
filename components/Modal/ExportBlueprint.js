import React from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { fetchingBlueprintContents } from "../../core/actions/blueprints";

class ExportBlueprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.handleModalToggle = this.handleModalToggle.bind(this);
  }

  componentDidMount() {
    this.props.fetchingBlueprintContents(this.props.blueprint.name);
  }

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
  };

  handleCopy() {
    this.blueprint_contents_text.select();
    document.execCommand("copy");
  }

  handleEnterKey(event) {
    if (event.which === 13 || event.keyCode === 13) {
      this.handleCopy();
    }
  }

  render() {
    return (
      <>
        <Button component="a" variant="plain" onClick={this.handleModalToggle}>
          <FormattedMessage defaultMessage="Export" />
        </Button>
        <Modal
          id="cmpsr-modal-export"
          variant={ModalVariant.medium}
          title={<FormattedMessage defaultMessage="Export blueprint" />}
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalToggle}
          actions={[
            <Button key="close" variant="secondary" onClick={this.handleModalToggle}>
              <FormattedMessage defaultMessage="Close" />
            </Button>,
            <Button key="copy" variant="primary" onClick={() => this.handleCopy()}>
              <FormattedMessage defaultMessage="Copy" />
            </Button>,
          ]}
        >
          <form className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="blueprint-name">
                <FormattedMessage defaultMessage="Blueprint" />
              </label>
              <div className="col-sm-9">
                <p className="form-control-static" id="blueprint-name">
                  {this.props.blueprint.name}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="textInput-modal-markup">
                <FormattedMessage defaultMessage="Export as" />
              </label>
              <div className="col-sm-9">
                <select className="form-control">
                  <FormattedMessage defaultMessage="Text" tagName="option" />
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="textInput2-modal-markup">
                <FormattedMessage defaultMessage="Contents" />
              </label>
              {(this.props.blueprint.components && (
                <div className="col-sm-9">
                  <textarea
                    readOnly
                    id="textInput2-modal-markup"
                    ref={(c) => {
                      this.blueprint_contents_text = c;
                    }}
                    className="form-control"
                    rows="10"
                    value={this.props.blueprint.components
                      .map((comp) => `${comp.name}-${comp.version}-${comp.release}`)
                      .join("\n")}
                    onKeyPress={(e) => this.handleEnterKey(e)}
                  />
                  <p>
                    <FormattedMessage
                      defaultMessage="{count} total components"
                      values={{
                        count: this.props.blueprint.components.length,
                      }}
                    />
                  </p>
                </div>
              )) || (
                <div className="col-sm-1">
                  <div className="spinner" />
                </div>
              )}
            </div>
          </form>
        </Modal>
      </>
    );
  }
}

ExportBlueprint.propTypes = {
  fetchingBlueprintContents: PropTypes.func,
  blueprint: PropTypes.shape({
    name: PropTypes.string,
    components: PropTypes.arrayOf(PropTypes.object),
  }),
};

ExportBlueprint.defaultProps = {
  fetchingBlueprintContents() {},
  blueprint: {},
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  fetchingBlueprintContents: (blueprint) => {
    dispatch(fetchingBlueprintContents(blueprint));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportBlueprint);
