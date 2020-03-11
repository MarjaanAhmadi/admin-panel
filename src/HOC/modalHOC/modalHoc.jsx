import React from "react";
class ModalHOC extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.renderViewComponent = this.renderViewComponent.bind(this);
        this.state = {
            open: false
        };
    }
    toggle() {
        this.setState({
            open: !this.state.open
        });
    }
    renderViewComponent(viewComponent, props) {
        if (typeof viewComponent === "function") {
            return viewComponent(props);
        }

        return <div onClick={this.toggle}>{viewComponent}</div>;
    }
    render() {
        const { modalComponent, viewComponent } = this.props;
        const { open } = this.state;

        const modalProps = {
          open,
          toggleModal: this.toggle
        };

        return (
            <React.Fragment>
                {this.renderViewComponent(viewComponent, modalProps)}
                {modalComponent(modalProps)}
            </React.Fragment>
        );
    }
}

export default ModalHOC;
