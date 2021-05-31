import React, { Component } from 'react'
import * as Three from 'three'
import styles from './styles.css'
import { Row, Col } from 'antd'

export default class ThreeField extends Component {
    state = {
        mouseIsClicking: false,
    }

    componentDidMount = () => {
        this.initThreeField()

    }

    mouseMove = () => {
        const { mouseIsClicking, mousePrePosition, mouseCurrentPosition } = this.state
        const event = window.event

        if (mouseIsClicking) {
            const x_diff = (mouseCurrentPosition?.x - mousePrePosition?.x) || 0
            const y_diff = (mouseCurrentPosition?.y - mousePrePosition?.y) || 0
            this.setState({
                x_diff: x_diff,
                y_diff: y_diff,
                mousePrePosition: mouseCurrentPosition,
                mouseCurrentPosition: {
                    x: event.pageX,
                    y: event.pageY
                }
            }, () => {
                const { currentObj } = this.state
                currentObj.rotation.x -= x_diff / 360;
                currentObj.rotation.y -= y_diff / 360;
            })
        } else {
            return
        }

    }

    mouseDown = () => {
        const event = window.event
        this.setState({
            mouseIsClicking: true,
            mouseCurrentPosition: {
                x: event.pageX,
                y: event.pageY
            }
        })
    }

    mouseUp = () => {
        this.setState({
            mouseIsClicking: false
        })
    }

    reset = () => {
        const { currentObj } = this.state
        currentObj.position.set(0, 0, 0);
        currentObj.rotation.x = 0
        currentObj.rotation.y = 0
    }

    exchange = () => {
        const { currentObj, objList, field_scene } = this.state
        const nextIndex = objList.indexOf(currentObj) + 1 < objList?.length ? objList.indexOf(currentObj) + 1 : 0
        const nextObj = objList[nextIndex]
        field_scene.remove(currentObj)
        field_scene.add(nextObj)
        this.setState({
            currentObj: nextObj
        })
    }

    initThreeField = () => {
        let field_width;
        let field_height;
        let field_renderer;
        let field_camera;
        let field_scene;
        let field_light;

        const initField = () => {
            field_height = window.innerHeight
            field_width = window.innerWidth
            field_renderer = new Three.WebGL1Renderer({
                antialias: true
            })
            field_renderer.setSize(field_width, field_height)
            document.getElementById('three-container').appendChild(field_renderer.domElement)
            field_renderer.setClearColor(0x000000, 1.0)
            this.setState({
                field_renderer: field_renderer
            })
        }

        const initCamera = () => {
            field_camera = new Three.PerspectiveCamera(45, field_width / field_height, 1, 10000);
            field_camera.position.set(1500, 400, 400)
            field_camera.up.set(0, 1, 0);
            field_camera.lookAt(0, 0, 0);
            this.setState({
                field_camera: field_camera
            })
        }

        const initScene = () => {
            field_scene = new Three.Scene()
            this.setState({
                field_scene: field_scene
            })
        }

        const initLight = () => {
            field_light = new Three.AmbientLight(0xFFFFFF);
            field_light.position.set(300, 300, 0);
            field_scene.add(field_light);
            this.setState({
                field_light: field_light
            })
        }

        const initObject = () => {
            var cube_geometry = new Three.BoxBufferGeometry(300, 25, 300);
            var cube_material = new Three.MeshLambertMaterial({
                color: 0x00ff7c, wireframe: true,
                wireframeLinewidth: 1
            });

            var circle_geometry = new Three.CircleBufferGeometry(300, 1);
            var circle_material = new Three.MeshLambertMaterial({
                color: 0x00ff7c, wireframe: true,
                wireframeLinewidth: 1
            });
            var circle = new Three.Mesh(circle_geometry, circle_material);
            var cube = new Three.Mesh(cube_geometry, cube_material);

            cube.position.set(0, 0, 0);
            circle.position.set(0, 0, 0);

            let objList = [cube, circle]
            this.setState({
                currentObj: cube,
                objList: objList
            }, () => {
                const { currentObj } = this.state
                field_scene.add(currentObj)
            })

        }

        const initMouseListener = () => {
            const main = document.getElementById('three-container')
            main.addEventListener('mousedown', this.mouseDown)
            main.addEventListener('mouseup', this.mouseUp)
            main.addEventListener('mousemove', this.mouseMove)
        }

        const animation = () => {
            field_renderer.render(field_scene, field_camera);
            requestAnimationFrame(animation);
        }
        initField()
        initCamera()
        initScene()
        initLight()
        initObject()
        animation()
        initMouseListener()
    }

    render() {
        return (
            <div>
                <div id='three-container' style={{ position: 'fixed' }}>
                </div>
                <div id='tools-container' className={styles.toolsContainer}>
                    <Row gutter={[10, 10]}>
                        <Col>
                            <button className={styles.btn_reset} onClick={this.exchange}>切换</button>
                        </Col>
                        <Col>
                            <button className={styles.btn_reset} onClick={this.reset}>重置</button>
                        </Col>
                    </Row>
                </div>
            </div>

        )
    }
}