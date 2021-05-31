import React from "react";
import { Form, Input, Row, Col, TextArea } from 'antd'
import styles from './styles.css'
const FormItem = Form.Item;
@Form.create()
class CodeField extends React.Component {
    state = {}
    render() {
        const { form: { getFieldDecorator } } = this.props
        return (
            <div className={styles.container}>
                <div className={styles.testField1}>
                    <Row style={{ height: '100%' }}>
                        <Col span={12}>
                            <Form colon={false}>
                                <FormItem>
                                    {getFieldDecorator('id')(
                                        <Input.TextArea onChange={(e) => { this.setState({ codeText: e.target.value }) }} style={{ height: '500px' }}>
                                        </Input.TextArea>
                                    )}
                                </FormItem>
                            </Form>
                        </Col>
                        <Col span={12}>
                            <pre style={{ backgroundColor: 'black', color: 'white', padding: 30, height: '500px', textAlign: 'left' }}>{this.state.codeText || null}</pre>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default CodeField;