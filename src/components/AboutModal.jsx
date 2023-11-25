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
        <p>Each guess must a be a <strong>valid transit trip involving 3 trains</strong> using available transfers between them.</p>
        <p>You need to guess a specific set of three lines that can make the trip. <strong>Multiple routings may be possible</strong>, but your goal is to
        find the one that matches the puzzle of the day.</p>

        <p><strong>Back tracking is allowed:</strong> you can travel inbound through a station, transfer, then travel back outbound.</p>

        <p>As of right now, <strong>you cannot transfer between branches on the same line</strong>, 
        i.e. you can't take a <TrainBullet id="GLE" size="small" /> train to Boylston and directly switch to a <TrainBullet id="GLC" size="small" /> train. 
        I would like to add this improvement in the future.</p>

        <p>Also, you cannot use the Park St / Downtown Crossing concourse to transfer, simulating the difficulty of doing so in real life.</p>

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
                  <TrainBullet id='RLB' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='OL' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='GLD' size='medium' />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <p>The <TrainBullet id='RLB' size='small' /> train is in the correct spot of the trip.</p>
<Segment basic>
          <Grid centered columns={4} className={isDarkMode ? 'game-grid dark' : 'game-grid'}>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='OL' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder className='similar'>
                  {settings.display.showAnswerStatusBadges &&
                    <Label as='a' floating circular size='tiny'>
                      <Icon name="sync alternate" fitted />
                    </Label>
                  }
                  <TrainBullet id='GLE' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='RLB' size='medium' />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <p>Another train that shares the same routing as the <TrainBullet id='GLE' size='small' /> train is in that spot of the trip.</p>

        <Segment basic>
          <Grid centered columns={4} className={isDarkMode ? 'game-grid dark' : 'game-grid'}>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='OL' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder className='present'>
                  {settings.display.showAnswerStatusBadges &&
                    <Label as='a' floating circular size='tiny'>
                      <Icon name="arrows alternate horizontal" fitted />
                    </Label>
                  }
                  <TrainBullet id='RLA' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='GLE' size='medium' />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <p>The <TrainBullet id='RLA' size='small' /> train is part of the trip, but in the wrong spot.</p>

        <Segment basic>
          <Grid centered columns={4} className={isDarkMode ? 'game-grid dark' : 'game-grid'}>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='GLD' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='OL' size='medium' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder className='absent'>
                  {settings.display.showAnswerStatusBadges &&
                    <Label as='a' floating circular size='tiny'>
                      <Icon name="x" fitted />
                    </Label>
                  }
                  <TrainBullet id='BL' size='medium' />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <p>The <TrainBullet id='BL' size='small' /> train is not part of the trip in any spot.</p>

        <Header as='h4'>Tips</Header>
        <p>Input using keyboard is supported.</p>

        <p><TrainBullet id="RLA" size="small" /> = an Ashmont Red Line train (inbound or outbound)</p>
        <p><TrainBullet id="RLB" size="small" /> = a Braintree Red Line train (inbound or outbound)</p>
        <p><TrainBullet id="RLM" size="small" /> = a Mattapan trolley train</p>

        <Header as='h4'>About</Header>

        <p>Boston version of the original <a href="https://www.subwaydle.com/" target="_blank">NYC Subwaydle</a>, created by <a href="https://www.sunny.ng" target="_blank">Sunny Ng</a><a href='https://twitter.com/_blahblahblah' target='_blank'><Icon name='twitter' link /></a>.</p>

        <p>Subwaydles around the world: <a href="https://hk.subwaydle.com" target="_blank">Hong Kong</a>, <a href="https://london.subwaydle.com" target="_blank">London</a>.</p>

        <p>MBTAdle by Madeleine Barowsky </p>
        <p><a href="https://github.com/madeleine-b/mbtadle" target="_blank">Source code</a>.</p>

      </Modal.Content>
    </Modal>
  );
}

export default AboutModal;
