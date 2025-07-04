import { useState } from 'react'
import { Button, Container, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';


function App() {
  const [emailContent, setEmailcontent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
       emailContent,
        tone
      });
      
      /*
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
      if (!response.ok) {
        throw new Error('Failed to generate reply');
      }

      const data = await response.json();
      setGeneratedReply(data.reply);
      */
      setGeneratedReply(response.data.reply || JSON.stringify(response.data));
    } 
    catch (error) {
      setError('Failed to generate reply. Please try again later.');
      console.error(error);
    } 
    finally {
      setLoading(false);
    }
  };




  return (
    <Container maxWidth="md" sx={{ py: 4 }}>

      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent ||''}
          onChange={(e)=> setEmailcontent(e.target.value)}
          sx={{mb:2}}/>

          <FormControl fullWidth sx={{mb:2}}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone || ''}
              label = {'Tone (Optional)'}
              onChange={(e) => setTone(e.target.value)}>
                <MenuItem value="">None</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="concise">Concise</MenuItem>
                <MenuItem value="apologetic">Apologetic</MenuItem>
                <MenuItem value="enthusiastic">Enthusiastic</MenuItem>
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="sympathetic">Sympathetic</MenuItem>
                <MenuItem value="assertive">Assertive</MenuItem>
            </Select>
          </FormControl>

          <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth>
            {loading ?<CircularProgress size={24} /> : 'Generate Reply'}
          </Button>
      </Box>

      {error && (
        <Typography color='color' sx={{ mb: 2 }}>
        {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            //value={generatedReply || ''}
            value={generatedReply.replace(/\\n/g, '\n')}
            InputProps={{readOnly: true}}/>

          <Button
            variant="outlined"
            onClick={() => navigator.clipboard.writeText(generatedReply)}
            sx={{ mt: 2 }}> 
            Copy to Clipboard
          </Button>

        </Box>
      )}

    </Container>
  )
}

export default App
