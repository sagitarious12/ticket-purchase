import React from 'react';
import './Artist.scss';
import { Concert } from '../../Types';
import { Button } from '../Button/Button';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { ConcertActions } from '../../Store/reducers/concerts';

interface ArtistProps {
  concert: Concert;
}

export const Artist = (props: ArtistProps) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const displayDate = () => {
    const date = new Date(props.concert.date);
    const day = date.toLocaleString();
    return day;
  }

  return (
    <div className="ArtistWrapper">
      <div className="ArtistImage">
        <img src={props.concert.artistImage} />
      </div>  
      <div className="ArtistDetails">
        <h2>{props.concert.title}</h2>
        <h4>Featuring: {props.concert.additionalArtists.join(', ')}.</h4>
        <p className="dateLocation">{displayDate()} - {props.concert.city}</p>
        <p className="venue">{props.concert.venue}</p>
      </div>      
      <div className="ArtistActions">
        <Button 
          onClick={() => {
            dispatch(ConcertActions.selectConcert(props.concert));
            navigate({pathname: `/checkout/${props.concert.id}`});
          }} 
          text='Get Tickets'
        />
      </div>
    </div>
  )
}