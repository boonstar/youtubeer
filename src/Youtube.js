import React, {Component} from 'react';
import Iframe from './Iframe'
import Player from './Player';
import './css/main.css';

const API = 'AIzaSyDUl8uWs-HIm_EUGVJcZGatOrBXbxdLpDM'
const qry = 'karen gillian'
const result = 5

// https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyDUl8uWs-HIm_EUGVJcZGatOrBXbxdLpDM&q=sexy


var finalURL = `https://www.googleapis.com/youtube/v3/search?key=${API}&q=${qry}&part=snippet&maxResults=${result}`
class Youtube extends Component {
  
  constructor(props){
    super(props);
    
    this.state = {
      isLoading: true,
      videos: []
      
    };
    
    this.fetchData = this.fetchData.bind(this);
    this.delCurrentSong = this.delCurrentSong.bind(this);
    this.insertSong = this.insertSong.bind(this);
  }
  
  
  delCurrentSong(id) {
    const newVideos = this.state.videos.filter(i => {
      return i.id !== id;
    })
    
    this.setState({
      videos: [ ...newVideos]
    })
    // this.refs.Player ? this.refs.Player.goNext() : null
  }
  


  componentWillMount() {
    console.log('componentWillMount')
      localStorage.getItem('videos') && this.setState({
          videos: JSON.parse(localStorage.getItem('videos')),
          isLoading: false
      })
  }
  

  componentDidMount(){

    console.log('componentDidMount')
      const date = localStorage.getItem('videosDate');
      const videosDate = date && new Date(parseInt(date, 10));
      const now = new Date();

      const dataAge = Math.round((now - videosDate) / (1000 * 60)); // in minutes
      const tooOld = dataAge >= 10;

      if(tooOld){
          this.fetchData();            
      } else {
          console.log(`Using data from localStorage that are ${dataAge} minutes old.`);
      }

  }
  

  
  
  fetchData(){
    console.log('Fetching data...')
    
    this.setState({
      isLoading: true,
      videos: []
    })
        
    fetch(finalURL)
    .then((response) => response.json())
    .then(parsedJson => parsedJson.items.map(vid => (
      {
        title: `${vid.snippet.title}`,
        id: `${vid.id.videoId}`,
        thumbnail: `${vid.snippet.thumbnails.default.url}`
      }
    )))
    .then(videos => this.setState({
      videos,
      isLoading: false
    }))
    .catch((error) => {
      console.error(error);
    })
  }
  
  
  componentWillUpdate(nextProps, nextState) {
      localStorage.setItem('videos', JSON.stringify(nextState.videos));
      localStorage.setItem('videosDate', Date.now());


  }

  insertSong(vid){
    const newVideos = this.state.videos.filter(i => {
      return i !== vid;
    })
    this.setState({
      videos: [vid, ...newVideos]
    })
  }
  
  
  
  render() {
    console.log('rendering...')
    const {videos} = this.state;
    

    return(
      <div className="container">
        
        
        <div className="row">
          <div className="col-md-10">
            
            {
              
              videos.length > 0 ? (
                <div>
                  <Player ref="Player" id={videos[0].id} title={videos[0].title}
                    delCurrentSong = {this.delCurrentSong}/>
                
                </div>
              ): null
            }
            
            <div>
              <button className="btn btn-default" onClick={(e) => {this.fetchData();}}>Get youtube videos</button>
              {console.log(videos.length)}
              {
                videos.length > 0 ? (
                  <button className="btn btn-default" onClick={(e) => {this.delCurrentSong(videos[0].id);}}>Next Song</button>
                ): null
              }
              
            </div>
            
            <input type="text"/>
            
          </div>
          
          
          <div className="col-md-2">
            {
              videos.map(vid => {
                return (
                  <div key={vid.id}>
                    <p>{vid.title}</p>
                    <img src={`${vid.thumbnail}`} alt={vid.id} onClick={e => this.insertSong(vid)}/>
                    
                  </div>
                  
                )
              })
            }
            
          </div>
          
        </div>
        
        {/* {
            !isLoading && contacts.length > 0 ? contacts.map(contact => {
                const {username, name, email, location} = contact;
                return <Collapsible key={username} title={name}>
                    <p>{email}<br />{location}</p>
                </Collapsible>
            }) : null
        } */}

        

        
        {/* {
          this.state.resultyt.map((link, i) => {
            console.log(link)  
            let frame = (
              <div key={i} className="youtube">
                <iframe title="This is a title"
                  width="560" height="315"
                  src={link}
                  frameBorder="0" allow="encrypted-media" allowFullScreen></iframe>
              </div>
            )
            return frame;
          })
        }
        
        {this.frame}
         */}
      </div>
    )
  }
}

export default Youtube;
