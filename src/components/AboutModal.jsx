import { Modal, Header, Grid, Segment, Icon, Label } from 'semantic-ui-react';
import TrainBullet from './TrainBullet';
import { loadSettings } from '../utils/settings';

import './AboutModal.scss';

const AboutModal = (props) => {
  const { open, handleClose, isDarkMode } = props;
  const settings = loadSettings();
  return (
    <Modal closeIcon open={open} onClose={handleClose} size='tiny' className={isDarkMode ? 'about-modal dark' : 'about-modal'}>
      <Modal.Header>How to Play</Modal.Header>
      <Modal.Content scrolling>
        <p>Guess the <strong>MBTAdle</strong> in 6 tries.</p>
        <p>Each guess must a be a <strong>valid transit trip involving 3 trains and/or buses</strong> using available transfers between them.</p>
        <p>You need to guess a specific set of three lines that can make the trip.</p>

        <Header as='h4'>Examples</Header>
        <Segment basic>
          <Grid centered columns={4} className={isDarkMode ? 'game-grid dark' : 'game-grid'}>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder className='correct'>
                  {settings.display.showAnswerStatusBadges &&
                    <Label as='a' floating circular size='tiny'>
                      <Icon name="check" fitted />
                    </Label>
                  }
                  <TrainBullet id='GLC' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='RL' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='BL' size='medium' />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <p>The <TrainBullet id='BL' size='small' /> train is in the correct spot of the trip.</p>


        <p><strong>Multiple routings may be possible</strong> to make the trip, but your goal is to
        find <strong>the one routing</strong> that matches the puzzle of the day. The solution <strong>may or may not</strong> be the fastest or efficient routing. It should also be noted that in the New York City Subway system, there are <strong>multiple stations with the same name</strong>.</p>
        <p><strong>No back tracking:</strong> No stations can be traveled through more than once.</p>
        <p><strong>Transfers are only allowed if and when lines diverge</strong> (i.e. if two lines are making the same stops, you can't switch back and forth between them,
          You can switch from a local line to an express line then back to the same local line, but you can't switch from an express line to a local line back to the same express line).</p>
        <p><strong>Transfers are allowed to/from St George station</strong> via <strong>South Ferry</strong>, <strong>Whitehall St–South Ferry</strong> or <strong>Bowling Green stations</strong> (using the Staten Island Ferry). Transfers are also allowed between stations with <strong>free out-of-system transfers</strong>.
          It is assumed that all stations allow transfer in all directions, even when they're not physically possible in real life (limitation due to this data is not being publicly available).</p>
        <p>Routing for each train line is based on <strong>midday schedule</strong> (i.e. no peak-direction express, no peak-only branches, no 
          Z, B terminates at 145 St). <strong>Weekend puzzles are based on regularly-scheduled weekend routings.</strong></p>
        <p>Follow <a href='https://twitter.com/subwaydle' target='_blank'>@subwaydle<Icon name='twitter' link /></a> for the previous day's solution and stats, updated daily.</p>

        <Header as='h4'>Tips</Header>
        <p>Input using keyboard is supported.</p>

        <Header as='h4'>About</Header>

        <p>Subwaydles around the world: <a href="https://hk.subwaydle.com" target="_blank">Hong Kong</a>, <a href="https://london.subwaydle.com" target="_blank">London</a>.</p>

        <p>Inspired by <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">Wordle</a>,
          its <a href="https://github.com/hannahcode/wordle" target="_blank">open-source clone</a>, <a href="https://nerdlegame.com/" target="_blank">Nerdle</a>,
          and <a href="https://www.nytransitmuseum.org/">New York Transit Museum</a> Trivia Nights.</p>

        <p>Created by <a href="https://www.sunny.ng" target="_blank">Sunny Ng</a><a href='https://twitter.com/_blahblahblah' target='_blank'><Icon name='twitter' link /></a></p>
        <p><a href="https://github.com/blahblahblah-/subwaydle" target="_blank">Source code</a>.</p>
        
      </Modal.Content>
    </Modal>
  );
}

export default AboutModal;
