import React from "react";
import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import Selection from "./songselection";
export default class Visualizer extends React.Component {
  state = {
    visualizer: null,
    audioContext: null,
    canvas: null
  };
  state = {
    visualizer: null,
    audioContext: null,
    canvas: null,
    width: "",
    height: "",
    fullscreen: false,
    presets: []
  };
  componentDidMount = () => {
    this.setState({ presets: butterchurnPresets.getPresets() });
    //get width of screen we will make this auto adjust later.
    const width = window.innerWidth;
    const height = window.innerHeight;

    //get state of canvas visualizer and audio context
    let { canvas, visualizer, audioContext } = this.state;

    //get canvas
    canvas = document.getElementById("canvas");

    //set width and height of canvas
    canvas.width = width;
    canvas.height = height;

    //create a new audio context
    audioContext = new AudioContext();

    //create visualizer with butterchurn
    visualizer = butterchurn.createVisualizer(audioContext, canvas, {
      width: width,
      height: height
    });

    //intialize with default values
    this.visualizerIntializer(visualizer, audioContext, canvas, width, height);
    this.resize();
  };
  resize = () => {
    let { canvas, visualizer, width, height, fullscreen } = this.state;

    //get width height
    let newwidth = window.innerWidth;
    let newheight = window.innerHeight;

    //compare size
    const total = newwidth + newheight;
    const oldTotal = width + height;
    //if not equal resize
    if (total !== oldTotal) {
      if (!fullscreen) {
        canvas = document.getElementById("canvas");
        //set width and height of canvas
        canvas.width = newwidth;
        canvas.height = newheight;
        //resize visualizer
        if (visualizer) {
          visualizer.setRendererSize(newwidth, newheight);
        }
        this.setState({
          width: newwidth,
          height: newheight
        });
      }
    }
  };
  visualizerIntializer = async (
    visualizer,
    audioContext,
    canvas,
    width,
    height
  ) => {
    visualizer.setRendererSize(width, height);
    this.setState({
      visualizer,
      audioContext,
      canvas,
      width,
      height
    });
    this.renderFrames();
    await setTimeout(() => {}, 500);

    this.randomPresets(visualizer);
  };
  renderFrames = () => {
    let { visualizer } = this.state;
    if (visualizer) {
      visualizer.render();
    }
    setTimeout(() => {
      this.renderFrames(visualizer);
      this.resize();
    }, 1000 / 120);
  };
  randomPresets = (visualizer) => {
    let { presets } = this.state;
    let tempPresets = presets;

    console.log(Object.keys(presets).length);

    if (Object.keys(tempPresets).length === 0) {
      tempPresets = butterchurnPresets.getPresets();
    }
    let randomPreset = this.randomProperty(tempPresets);
    if (visualizer) {
      visualizer.loadPreset(tempPresets[randomPreset], 2); // 2nd argument is the number of seconds to blend presets
      delete tempPresets[randomPreset];
      this.setState({
        presets: tempPresets
      });
    }
    setTimeout(() => {
      return this.randomPresets(visualizer);
    }, 30000);
  };
  randomProperty = (obj) => {
    const key = Object.keys(obj);
    return key[Math.floor(Math.random() * key.length)];
  };

  render() {
    return (
      <>
        {this.state.visualizer && this.state.audioContext ? (
          <Selection
            Visualizer={this.state.visualizer}
            audioContext={this.state.audioContext}
          />
        ) : null}
        <canvas id="canvas" />
        <img src="syqel.png" className="watermark" />
      </>
    );
  }
}
