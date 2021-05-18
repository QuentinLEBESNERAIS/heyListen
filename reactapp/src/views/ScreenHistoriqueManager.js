import React from 'react';
import '../App.css';
import {Row,Col,Input,Typography,Slider,Layout,Select,Divider,Empty} from 'antd'
import {StopOutlined,FrownOutlined,SmileOutlined,EyeOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom'
import Nav from './Nav'
import {connect} from 'react-redux'

function ScreenHistoriqueManager(props) {
    const {Sider, Content} = Layout;
    const {Option} = Select;

    if(props.userId.type==="manager"){
    return (
    <div>
        <Layout  style={{backgroundColor:'#FFFFFF'}}>
            <Nav/>
            <Col span={23} offset={1} style={{marginTop:10, marginBottom:20}}>
                <Typography.Text>Séléctioner un collaborateur :</Typography.Text>
                <Select defaultValue="Collaborateur" style={{width: 160, marginLeft:20}}>
                    <Option value="Michel Tichou">Michel Tichou</Option>
                </Select>
            </Col>
            <Empty/>
            <Layout style={{marginTop:20,backgroundColor:'#FFFFFF'}}>
                <Sider style={{backgroundColor:'#D8E3E7'}}>
                    <Row>
                        <Col span={22} offset={2}>
                            <Select defaultValue="Année" style={{width: 160, marginTop:20}}>
                                <Option value="2021">2021</Option>
                                <Option value="2020">2020</Option>
                                <Option value="2019">2019</Option>
                                <Option value="2018">2018</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row type="flex" align-item="center">
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Janvier</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Février</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Mars</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Avril</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Mai</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col><Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Juin</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Juillet</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Aout</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Septembre</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Octobre</Typography.Text>
                            <EyeOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Novembre</Typography.Text>
                            <StopOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                            <Typography.Text>Décembre</Typography.Text>
                            <StopOutlined style={{ fontSize: '20px',marginRight:5, marginLeft:5, verticalAlign:"middle"}}/>
                        </Col>
                    </Row>
                </Sider>
                <Content>
                    <Row>
                        <Col span={24} offset={0}>
                            <div className="icon-wrapper">
                                <FrownOutlined style={{color:'#A62626'}}/>
                                <Slider marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} value ="2" 
                                min={1} max={5}/>
                                <SmileOutlined style={{color:'#448f30'}}/>
                            </div>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 1</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 1" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 2</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 2" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 3</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 3" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 4</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 4" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>Question 5</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse Question 5" disabled="trues"/>
                        </Col>
                        <Divider>FeedBack Manager</Divider>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>FeedBack 1</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse FeedBack 1" disabled="trues"/>
                        </Col>
                        <Col span={22} offset={2}>
                            <Col style={{marginBottom:4}}>
                                <Typography.Text>FeedBack 2</Typography.Text>
                            </Col>
                            <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder="Réponse FeedBack 2" disabled="trues"/>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    </div>
    )}else{return <Redirect to='/historique-collab'/> }
    ;
}

function mapStateToProps(state) {
    console.log('test userStore',state.user._id)
    return { userId: state.user }
}

export default connect(
    mapStateToProps,
    null
)(ScreenHistoriqueManager);