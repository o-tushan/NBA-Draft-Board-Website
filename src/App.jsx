import React, {useState} from 'react';
import './App.css'
import data from './intern_project_data.json'
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Drawer, Typography, IconButton, Box, AppBar, Toolbar, Button
} from '@mui/material';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const draftData = data.bio
const scoutData = data.scoutRankings
const gameData = data.seasonLogs
const rankingFields = ["ESPN Rank", "Sam Vecenie Rank", "Kevin O'Connor Rank", "Kyle Boone Rank", "Gary Parrish Rank"]
const reportData = data.scoutingReports

const calculateAge = (birthDate) => {
    const birth = new Date(birthDate)
    const today = new Date()

    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age -= 1
    }
    return age
}


function App() {
  /*const [count, setCount] = useState(0)*/

  return (
      <div className = "App">
          <DraftBoard />
      </div>
  )
}


function DraftBoard() {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const handleClick = (player) => {
        setSelectedPlayer(player);
    };
    const handleClose = () => {
        setSelectedPlayer(null);
    };

    const matchingPlayer = scoutData.find(stat => stat.playerId === selectedPlayer?.playerId);
    const matchingPlayerGS = gameData.find(stat => stat.playerId === selectedPlayer?.playerId && stat.League === "NCAA");
    const rankingValues = rankingFields.map(field => matchingPlayer?.[field]).filter(val => val != null && !isNaN(val))

    const prospectRanking = rankingValues.length > 0 ? rankingValues.reduce((sum, val) => sum + val) / rankingValues.length : null

    const [customReports, setCustomReports] = useState([])
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [selectedPlayerId, setSelectedPlayerId] = useState('')
    const [reportText, setReportText] = useState('')
    const [scoutName, setScoutName] = useState('')

    const matchingReports = [
        ...reportData.filter(stat => stat.playerId === selectedPlayer?.playerId),
        ...customReports.filter(stat => stat.playerId === selectedPlayer?.playerId)
    ];

    const [filteredData, setFilteredData] = useState(draftData);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);

    const [showCollegeSelect, setShowCollegeSelect] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState('');
    const collegeOptions = [...new Set(draftData.map(player => player.currentTeam).filter(Boolean))]

    const [showLeagueSelect, setShowLeagueSelect] = useState(false);
    const [selectedLeagueType, setSelectedLeagueType] = useState('');



    return (
        <>
            {/*Top Bar with buttons*/}
            <AppBar position = "static" color = "inherit" sx = {{mb: 3}}>
                <Toolbar>
                    <Typography variant = "h6" sx = {{flexGrow : 1}}>
                        Dallas Mavericks Draft Board
                    </Typography>
                    <Button
                        color = "inherit"
                        variant = "outlined"
                        sx = {{borderColor: 'black', color: 'black', mr: 5}}
                        onClick = {() => setAddDialogOpen(true)}>
                        Add New Report
                    </Button>
                    <Button
                        color = "inherit"
                        variant = "outlined"
                        sx = {{borderColor: 'black', color: 'black', mr: 3}}
                        onClick = {() => setFilterDialogOpen(true)}
                    >
                        Filter players
                    </Button>
                </Toolbar>
            </AppBar>

            {/*Title as well as the Table with the Draft Prospects*/}
            <Box sx={{ maxWidth: '800px', pb: 6, margin: '0 auto', mt: 3}}>
            <h1 style = {{textAlign : 'center'}}>2025 Draft Big Board</h1>
                <TableContainer
                    component = {Paper}
                    sx = {{
                        border: '2px solid black',
                        borderRadius: '30px',
                        overflow: 'hidden',
                    }}

                >
                    <Table
                        className = "draft-board"
                        sx = {{
                            borderCollapse: 'collapse',
                            '& td, & th': {
                                borderBottom: 'none',
                            },
                            '& tr': {
                                borderBottom: 'none',
                            }
                        }}
                    >
                        <TableHead style={{borderBottom: 'none', borderRight: 'none', backgroundColor: '#E8E8E8'}}>
                            <TableRow>
                                <TableCell sx={{ width: '10%', paddingLeft: '20px'}}>Overall ranking</TableCell>
                                <TableCell sx={{ width: '30%', paddingLeft: '60px'}}>Name</TableCell>
                                <TableCell sx={{ width: '10%'}}>Age</TableCell>
                                <TableCell sx={{ width: '20%'}}>Height</TableCell>
                                <TableCell sx={{ width: '30%', paddingRight: '60px', textAlign: 'center'}}>Current Team</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredData.map((player, index) => (
                            <TableRow
                                key={index}
                                hover
                                onClick={() => handleClick(player)}
                                style={{cursor: 'pointer', backgroundColor: index % 2 === 0 ? '#ffffff' : '#E8E8E8'}}>
                                <TableCell sx={{ width: '10%', paddingLeft: '38px'}}>
                                    {draftData.findIndex(p => p.playerId === player.playerId) + 1}
                                </TableCell>
                                <TableCell sx={{ width: '10%', paddingLeft: '40px'}}>{player.name}</TableCell>
                                <TableCell sx={{ width: '30%', paddingLeft: '20px'}}>{calculateAge(player.birthDate)}</TableCell>
                                <TableCell sx={{ width: '30%', paddingLeft: '25px'}}>{Math.floor(player.height / 12) + "' " + player.height % 12 + "\""}</TableCell>
                                <TableCell sx={{ width: '20%', paddingRight: ''}}>{player.currentTeam}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box>

            <Drawer
                anchor = "right"
                open = {Boolean(selectedPlayer)}
                onClose = {handleClose}
                PaperProps = {{
                    sx: {
                        width: 350,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                    }
                }}

            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
                    <Typography variant = "h6" component = "div">
                        {selectedPlayer?.name}
                    </Typography>
                    <IconButton onClick = {handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <TableContainer component = {Paper}></TableContainer>

                {selectedPlayer && (
                    <Box sx={{ overflowY: 'auto', flex: 1, p: 2 }}>
                        <img
                            src = {selectedPlayer.photoUrl || 'https://via.placeholder.com/300x400?text=No+Photo'}
                            alt = {selectedPlayer.name}
                            style = {{width: '50%'}}
                        />


                        {/*this is player personal stats*/}
                        <Typography sx={{ whiteSpace: 'pre-line', textDecoration: 'underline' }}>
                            <strong>{'\nPlayer Stats'}</strong>
                        </Typography>
                        <Typography>
                            <strong>Age: </strong>
                            {calculateAge(selectedPlayer.birthDate)}
                        </Typography>
                        <Typography>
                            <strong>Height: </strong>
                            {Math.floor(selectedPlayer.height / 12) + "' " + (selectedPlayer.height % 12) + '"'}
                        </Typography>
                        <Typography>
                            <strong>Weight: </strong>
                            {selectedPlayer.weight} lbs
                        </Typography>
                        <Typography>
                            <strong>Team: </strong>
                            {selectedPlayer.currentTeam}
                        </Typography>
                        <Typography>
                            <strong>Home Country: </strong>
                            {selectedPlayer.homeCountry}
                        </Typography>


                        {/*this is ranking info*/}
                        <Typography sx={{ whiteSpace: 'pre-line', textDecoration: 'underline' }}>
                            <strong>{'\nAssessments from Different Outlets'}</strong>
                        </Typography>

                        {matchingPlayer ? (
                            <>
                        <Typography>
                            {matchingPlayer?.["ESPN Rank"] && (<Typography><strong>ESPN Rank:</strong> {matchingPlayer["ESPN Rank"]}</Typography>)}
                        </Typography>
                        <Typography>
                            {matchingPlayer?.["Sam Vecenie Rank"] && (<Typography><strong>Sam Vecenie Rank:</strong> {matchingPlayer["Sam Vecenie Rank"]}</Typography>)}
                        </Typography>
                        <Typography>
                            {matchingPlayer?.["Kevin O'Connor Rank"] && (<Typography><strong>Kevin O'Connor Rank:</strong> {matchingPlayer["Kevin O'Connor Rank"]}</Typography>)}
                        </Typography>
                        <Typography>
                            {matchingPlayer?.["Kyle Boone Rank"] && (<Typography><strong>Kyle Boone Rank:</strong> {matchingPlayer["Kyle Boone Rank"]}</Typography>)}
                        </Typography>
                        <Typography>
                            {matchingPlayer?.["Gary Parrish Rank"] && (<Typography><strong>Gary Parrish Rank:</strong> {matchingPlayer["Gary Parrish Rank"]}</Typography>)}
                        </Typography>
                        <Typography sx ={{whiteSpace: 'pre-line'}}>
                            {prospectRanking != null && (<Typography sx = {{whiteSpace: 'pre-line'}}>
                                {'\n'}
                                <strong>Predicted Draft Spot: </strong>
                                {prospectRanking <= 1 ? 'Clear #1 Overall'
                                : prospectRanking <= 5 ? 'Consensus Top 5 Pick'
                                : prospectRanking <= 20 ? 'First Round Pick Based on Team Need'
                                : prospectRanking <= 40 ? 'Late First Rounder or Second Rounder'
                                : 'Late Second Rounder'}
                            </Typography>
                            )}
                        </Typography>
                        </>
                            ) : (<Typography> No ranking data available</Typography>)
                        }


                        {/*This is player game stats*/}
                        <Typography sx={{ whiteSpace: 'pre-line', textDecoration: 'underline' }}>
                            <strong>{'\nSeason Stats'}</strong>
                        </Typography>

                        {matchingPlayerGS ? (
                            <>
                        <Typography>
                            <strong>Games Played: </strong>
                            {matchingPlayerGS.GP + " (Started in " + matchingPlayerGS.GS + ")"}
                        </Typography>
                        <Typography>
                            <strong>Minutes Played Per Game: </strong>
                            {matchingPlayerGS.MP}
                        </Typography>
                        <Typography>
                            <strong>Field Goal Percent: </strong>
                            {matchingPlayerGS["FG%"] + "%"}
                        </Typography>
                        <Typography>
                            <strong>3 Point Percent: </strong>
                            {matchingPlayerGS["3P%"] + "%"}
                        </Typography>
                        <Typography>
                            <strong>Free Throw Percent: </strong>
                            {matchingPlayerGS["FTP"] + "%"}
                        </Typography>

                        {/*Points, Assists, Rebounds, Blocks, Steals*/}
                        <Typography sx={{ whiteSpace: 'pre-line', textDecoration: 'underline' }}>
                            <strong>{'\nStats Per Game'}</strong>
                        </Typography>
                        <Typography>
                            <strong>Points: </strong>
                            {matchingPlayerGS.PTS}
                        </Typography>
                        <Typography>
                            <strong>Assists: </strong>
                            {matchingPlayerGS.AST}
                        </Typography>
                        <Typography>
                            <strong>Rebounds: </strong>
                            {matchingPlayerGS.TRB}
                        </Typography>
                        <Typography>
                            <strong>Blocks: </strong>
                            {matchingPlayerGS.BLK}
                        </Typography>
                        <Typography>
                            <strong>Steals: </strong>
                            {matchingPlayerGS.STL}
                        </Typography>
                        <Typography>
                            <strong>Turnovers: </strong>
                            {matchingPlayerGS.TOV}
                        </Typography>
                            </>
                        ) : (<Typography> No game stats available</Typography>)
                        }

                        <Typography sx={{ whiteSpace: 'pre-line', textDecoration: 'underline' }}>
                            <strong>{'\nScouting Reports'}</strong>
                        </Typography>

                        {matchingReports.length > 0 ? (
                            matchingReports.map((report, index) => (
                                <Box key = {index} sx = {{ mb : 2}}>
                                    <Typography sx ={{whiteSpace: 'pre-line'}}>
                                        {'\n'}
                                        <strong>Scout: </strong>
                                        {report.scout}
                                    </Typography>
                                    <Typography>
                                        <strong>Report: </strong>
                                        {report.report}
                                    </Typography>
                                </Box>
                            ))
                        ) : (<Typography> No scouting reports available</Typography>)
                        }

                        <Typography sx={{ whiteSpace: 'pre-line', textDecoration: 'underline' }}>
                            <strong>{'\n\n'}</strong>
                        </Typography>


                    </Box>
                )}
            </Drawer>

            {/*Dialog for the add scout report button*/}
            <Dialog open = {addDialogOpen} onClose = {() => setAddDialogOpen(false)}>
                <DialogTitle>Add Scouting Report</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options = {draftData}
                        getOptionLabel = {(option) => option.name}
                        value = {draftData.find(p => p.playerId === selectedPlayerId) || null}
                        onChange = {(e, newValue) => {
                            setSelectedPlayerId(newValue ? newValue.playerId : '');
                        }}
                        renderInput = {(params) => (
                            <TextField {...params} label = "Player Name" margin = "dense" fullWidth />
                        )}
                    />
                    <TextField
                        label = "Scout Name"
                        fullWidth
                        margin = "dense"
                        value = {scoutName}
                        onChange = {(e) => setScoutName(e.target.value)}
                    />
                    <TextField
                        label = "Report"
                        fullWidth
                        margin = "dense"
                        multiline
                        rows = {4}
                        value = {reportText}
                        onChange = {(e) => setReportText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick = {() => setAddDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick = {() => {
                            setCustomReports(prev => [...prev,
                                {
                                    playerId: selectedPlayerId,
                                    scout: scoutName || 'Anonymous Executive',
                                    report: reportText
                                }
                            ]);
                            setSelectedPlayerId('');
                            setScoutName('');
                            setReportText('');
                            setAddDialogOpen(false);
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/*This is the functionality for the 'Filter Players' button*/}
            <Dialog open = {filterDialogOpen} onClose = {() => setFilterDialogOpen(false)}>
                <DialogTitle>Filter Players</DialogTitle>
                <DialogContent>
                    {!showCollegeSelect && (
                        <Box sx = {{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <Button
                                variant = "contained"
                                onClick = {() => setShowCollegeSelect(true)}
                            >
                                Filter by College
                            </Button>

                            <Button
                                variant = "contained"
                                onClick = {() => {
                                    const filtered = draftData.filter(p => p.leagueType === "NCAA");
                                    setFilteredData(filtered);
                                    setFilterDialogOpen(false);
                                }}
                            >
                                Filter by College/Professional
                            </Button>
                        </Box>
                    )}

                    {showCollegeSelect && (
                        <Box sx = {{width: '300px', maxWidth: '100%'}}>
                            <Autocomplete
                                options = {collegeOptions}
                                value = {selectedCollege || null}
                                onChange = {(event, newValue) => setSelectedCollege(newValue || '')}
                                renderInput = {(params) => (
                                    <TextField {...params} label = "Select College" margin = "dense" fullWidth/>
                                )}
                            />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    {showCollegeSelect ? (
                        <>
                            <Button
                                onClick = {() => {
                                    setFilteredData(draftData.filter(p => p.currentTeam === selectedCollege));
                                    setSelectedCollege('');
                                    setShowCollegeSelect(false);
                                    setFilterDialogOpen(false);
                                }}
                            >
                                Apply
                            </Button>
                            <Button
                                onClick = {() => {
                                    setSelectedCollege('');
                                    setShowCollegeSelect(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick = {() => {
                                    setFilteredData(draftData);
                                    setFilterDialogOpen(false);
                                }}
                            >
                                Clear Filter
                            </Button>
                            <Button onClick = {() => setFilterDialogOpen(false)}>
                                Close
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

        </>

    );
}

export default App
