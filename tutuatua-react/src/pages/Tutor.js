import React, { Component } from 'react';
import './Tutor.css';
import { Descriptions, Tabs, Input, Button, Popover, Calendar, List, Avatar } from 'antd';
import { PopoverDay } from '../components/PopoverDay';
import { PopReserveTutor } from '../components/PopReserveTutor';
import Axios from '../config/axios.setup';

// === Tabs === //
const { TabPane } = Tabs;
function callback(key) {
  // console.log(key);
} // End Tabs

class Tutor extends Component {

  state = {
    // === profile === //
    username: '',
    telephone: '',
    image: '',
    skills: [],
    edus: [],
    awards: [],  
    changeImage: '',

    // === calendar === //
    schedules: [], // { id: ,date: ,timeRange: , price: }   

    // === comment === //
    comments: []
  }

  // === Profile Function === //
  handleAddSkill = () => {
    this.setState(
      { skills: [...this.state.skills,{id:Math.round(Math.random()*1000)}] },
      // ()=>console.log(this.state.skills)
    )
  }
  handleChangeSkill = (targetId) => (e) => {
    this.setState(
      { 
        skills: this.state.skills.map(skill => skill.id === targetId ? 
          {...skill, detail: e.target.value} : skill) 
      },
      // ()=>console.log(this.state.skills)
    )
  }
  handleDeleteSkill = (targetId) => () => {
    this.setState(
      {skills: this.state.skills.filter(skill => skill.id !== targetId)},
      // ()=>console.log(this.state.skills)
    )
  }

  handleAddEdu = () => {
    this.setState(
      { edus: [...this.state.edus,{id:Math.round(Math.random()*1000)}] },
      // ()=>console.log(this.state.edus)
    )
  }
  handleChangeEdu = (targetId) => (e) => {
    this.setState(
      { 
        edus: this.state.edus.map(edu => edu.id === targetId ? 
          {...edu, detail: e.target.value} : edu) 
      },
      // ()=>console.log(this.state.edus)
    )
  }
  handleDeleteEdu = (targetId) => () => {
    this.setState(
      {edus: this.state.edus.filter(edu => edu.id !== targetId)},
      // ()=>console.log(this.state.edus)
    )
  }

  handleAddAward = () => {
    this.setState(
      { awards: [...this.state.awards, {id:Math.round(Math.random()*1000)}] },
      // ()=>console.log(this.state.awards)
    )
  }
  handleChangeAward = (targetId) => (e) => {
    this.setState(
      { 
        awards: this.state.awards.map(award => award.id === targetId ? 
          {...award, detail: e.target.value} : award) 
      },
      // ()=>console.log(this.state.awards)
    )
  }
  handleDeleteAward = (targetId) => () => {
    this.setState(
      {awards: this.state.awards.filter(award => award.id !== targetId)},
      // ()=>console.log(this.state.awards)
    )
  } 

  updateProfile = async () => {
    try {
        let result = await Axios.put('/updateProfile',{
          telephone: this.state.telephone,
          image: this.state.changeImage ? this.state.changeImage : this.state.image,
          skills: this.state.skills,
          edus: this.state.edus,
          awards: this.state.awards
        })  
      console.log(result.data)
      this.setState({ changeImage: '' })
    } catch (err) {
      console.log(err)
    }   

    // refresh
    try {
      let result = await Axios.get('/getProfile')
      console.log(result.data)
      this.setState({
        image: result.data.image
      })
    } catch (error) {
      console.log(error)
    }  
  }
  
  // === Calendar Function === //
  dateCellRender = (moment) => {      

    let handleAddSchedule = async (fromtime,totime,price) => {
      try {
        let id = Math.round(Math.random()*1000);
        let result = await Axios.post('/addSchedule/'+id, {        
        date: moment.format('L'),
        timeRange: fromtime + '-' + totime,
        price: price,
        status: false
      })
        // console.log(result.data)  

        // === refresh === //
        try {
          let resultSchedule = await Axios.get('/getSchedule')
          this.setState({ schedules: resultSchedule.data })
        } catch (error) {
          console.log(error)
        }        

      } catch (err) {
        console.log(err)
      }   
    }

    let filterScheduleDay = (schedules) => {
      let result = schedules.filter(
        schedule => schedule.date.slice(3,5) == moment.date()
      )  
      result = result.filter(
        schedule => schedule.date.slice(0,2) == moment.month()+1
      )
      result = result.filter(
        schedule => schedule.date.slice(6) == moment.year()
      )
      return result
    }    

    let handleDeleteSchedule = (targerId) => async () => {
      try {
        let result = await Axios.delete('/deleteSchedule/'+targerId)
        console.log(result)

        // === refresh === //
        try {
          let resultSchedule = await Axios.get('/getSchedule')
          this.setState({ schedules: resultSchedule.data })
        } catch (error) {
          console.log(error)
        }  

      } catch (error) {
        console.log(error)
      }           
    }

    return (       
      <div>        
        <PopoverDay handleAddSchedule={handleAddSchedule} /> 
        {filterScheduleDay(this.state.schedules).map( schedule => 
          <PopReserveTutor key={schedule.id}
            schedule={schedule}      
            handleDeleteSchedule={handleDeleteSchedule}      
          />
        )}             
      </div>    
    );
  }

  getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  }
  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  // === Extra === //

  handleLogOut = () => {
    localStorage.removeItem('ACCESS_TOKEN')
    this.props.history.push('/login')
  }

  componentDidMount = async () => {
    try {
      let resultProfile = await Axios.get('/getProfile')
      // console.log(resultProfile.data)
      this.setState({
        username: resultProfile.data.username,
        telephone: resultProfile.data.telephone,
        image: resultProfile.data.image,
        skills: resultProfile.data.skills,
        edus: resultProfile.data.education,
        awards: resultProfile.data.awards
      })

      let resultSchedule = await Axios.get('/getSchedule')
      // console.log(resultSchedule.data)
      this.setState({
        schedules: resultSchedule.data
      })

      let resultComment = await Axios.get('/getComment')
      // console.log(resultComment.data)
      this.setState({
        comments: resultComment.data
      })

    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div id='container-tutor'> 
        
        <Tabs onChange={callback} type="card" >
          {/* Tab 1 */}
          <TabPane id='tutor-left-tab' tab="Profile" key="1">

            <Popover placement="right" title={'Image URL'} 
              content={<Input onChange={e => this.setState({ changeImage: e.target.value })}
                value={this.state.changeImage} 
              />} 
              trigger="click"
            > 
              <div style={{height:'200px', marginBottom:'15px'}}>
              {this.state.image ?
                <img id='img-profile-tutor' src={this.state.image} /> :
                <div>Choose Image</div>
              }  
              </div>                 
            </Popover>                  
                     
            <Descriptions
              title={`Teacher - ${this.state.username}`}
              bordered
              column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
              >

              <Descriptions.Item label='Telephone'>
                <Input className='tutor-input' 
                  placeholder='Type somthing ...' 
                  onChange={e => this.setState({telephone: e.target.value})}
                  value={this.state.telephone}
                />                              
              </Descriptions.Item>

              <Descriptions.Item label="Skills">
                {this.state.skills.map((skill, index) =>
                  <Input key={skill.id}
                    className='tutor-input'
                    placeholder='Type somthing ...' 
                    onChange={this.handleChangeSkill(skill.id)}
                    value={skill.detail}
                    suffix = {<span id='write-delete'>
                      <i className="fas fa-trash"
                        onClick={this.handleDeleteSkill(skill.id)}
                      ></i>                      
                    </span>}
                  />                 
                )}
                <div className='addEdu' onClick={this.handleAddSkill} > 
                 ... 
                </div>
              </Descriptions.Item> 
      
              <Descriptions.Item label="Education">
                {this.state.edus.map((edu, index) =>
                  <Input key={edu.id}
                    className='tutor-input'
                    placeholder='Type somthing ...' 
                    onChange={this.handleChangeEdu(edu.id)}
                    value={edu.detail}
                    suffix = {<span id='write-delete'>
                      <i className="fas fa-trash"
                        onClick={this.handleDeleteEdu(edu.id)}
                      ></i>                      
                    </span>}
                  />                 
                )}
                <div className='addEdu' onClick={this.handleAddEdu} > 
                 ... 
                </div>
              </Descriptions.Item>              

              <Descriptions.Item label="Awards">
                {this.state.awards.map((award, index) =>  
                  <Input key={award.id}
                    className='tutor-input'
                    placeholder='Type somthing ...' 
                    onChange={this.handleChangeAward(award.id)}
                    value={award.detail}
                    suffix = {<span id='write-delete'>
                      <i className="fas fa-trash"
                        onClick={this.handleDeleteAward(award.id)}
                      ></i>                      
                    </span>}
                  />                 
                )}
                <div className='addAward'
                  onClick={ this.handleAddAward }
                > 
                 ... 
                </div>
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
                        marginTop:'20px'}}
            >
              <Button onClick={this.updateProfile} >Save</Button>   
              <Button onClick={this.handleLogOut}>
                <i style={{fontSize:'15px'}} class="fas fa-sign-out-alt"></i>
              </Button>
            </div>
            
                  
          </TabPane>

          {/* Tab 2 */}
          <TabPane tab="Comment" key="2">    
            <List
              itemLayout="horizontal"
              dataSource={this.state.comments}              
              renderItem={item => (                                              
                <List.Item>         
                  <img  style={{width:'50px',height:'50px', margin:'0px 20px 0px 10px'}} 
                    src={item.user.image} 
                  />
                  <List.Item.Meta                                       
                      title={<b>{item.user.username}</b>}
                      description={item.text}
                    />
                </List.Item>
              )}
            />                   
          </TabPane>

        </Tabs>        
            
        <Calendar 
            // style={{backgroundColor:'#e6ffff'}}
            dateCellRender={this.dateCellRender} 
            monthCellRender={this.monthCellRender} 
        />         
        
      </div>
    );
  }
}

export default Tutor;

