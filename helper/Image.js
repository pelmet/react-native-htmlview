import React from 'react';
import {
    Image,
    Dimensions,
} from 'react-native';

var {width} = Dimensions.get('window')

var baseStyle = {
  backgroundColor: 'transparent',
}
var ResizableImage = React.createClass({
  getInitialState: function() {
    return {
      // set width 1 is for preventing the warning
      // You must specify a width and height for the image %s
      width: this.props.style.width || 1,
      height: this.props.style.height || 1,
      paddingLeft: 0
    }
  },
  componentDidMount: function() {

    try {
      setTimeout(() => {
        this.refs.img.measureInWindow(this.measureView)
      }, 0);
    } catch(e) {
      console.log(e);
    }

    //avoid repaint if width/height is given
    if (this.props.style.width || this.props.style.height) {
      return
    }
    Image.getSize(this.props.source.uri, (w, h) => {
      this.setState({width:w, height:h})
    })
  },

  measureView: function(x, y, width, height) {
    this.setState({ paddingLeft: x, })
  },

  render: function() {
    var finalSize = {}
    let padding = this.state.paddingLeft * 2;

    if (this.state.width > width) {
      finalSize.width = width - padding
      var ratio = width / this.state.width
      finalSize.height = (this.state.height * ratio) - padding;
    }
    var style = Object.assign(baseStyle, this.props.style, this.state, finalSize)
    var source = {}
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state)
    } else {
      source = Object.assign(source, this.props.source, finalSize)
    }

    return (
      <Image
        ref='img'
        style={style}
        source={source} />
    )
  },
})

module.exports = ResizableImage
