import React from 'react';
import { RootState } from '../../Store/Store';
import { useDispatch, useSelector } from 'react-redux';
import { Concert } from '../../Types';
import { Card } from '../../Components/Card/Card';
import { Artist } from '../../Components/Artist/Artist';

export interface AppProps {
  [key: string]: string;
}

export const App = (props: AppProps) => {
  const concerts = useSelector((state: RootState) => state.concertReducer.activeConcerts);

  return (
    <div data-testid="AppWrapper" className="AppWrapper">
      <div className="TicketsTitle">
        <h1>Upcoming Shows</h1>
        <p>Get Tickets Now!</p>
      </div>
      {
        concerts.length > 0 ? (
          concerts.map((concert: Concert) => {
            return (
              <Card key={`concert-${concert.title}`}>
                <Artist concert={concert} />
              </Card>
            )
          })
        ) : (
          <p>No upcoming shows at this time! D:</p>
        )
      }
    </div>
  )
}
