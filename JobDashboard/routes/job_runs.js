var express = require('express');
var router = express.Router();
const ADODB = require('node-adodb');
var configDB = require('../config/database');


/* GET Uniq Job Names. */
router.get('/jobnames', function(req, res, next) {
	
	var connectionString = 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=' + configDB.dbPath + ';Persist Security Info=False;';
	const connection = ADODB.open(connectionString);
	
	connection
	  .query('select distinct job_name from Table_JobRun')
	  .then(data => {    
	    res.send(data);  
	  })
	  .catch(error => {
	    console.error(error);
	  });
});

/* GET Min Max Date. */
router.get('/dateminmax', function(req, res, next) {
	
	var connectionString = 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=' + configDB.dbPath + ';Persist Security Info=False;';
	const connection = ADODB.open(connectionString);
	
	connection
	  .query('select min(tr_date) as mindate, max(tr_date) as maxdate from Table_JobRun')
	  .then(data => {    
	    res.send(data);  
	  })
	  .catch(error => {
	    console.error(error);
	  });
});

/* POST filtered jobs data. */
router.post('/', function(req, res, next) {
	
	var connectionString = 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=' + configDB.dbPath + ';Persist Security Info=False;';
	const connection = ADODB.open(connectionString);
	
	connection
	  .query('SELECT * FROM Table_JobRun where job_name = "' + req.body.jobName + '" and tr_date between #' + req.body.startDate + '# and #' + req.body.endDate + '#;')
	  .then(data => {    
	    res.send(data);  
	  })
	  .catch(error => {
	    console.error(error);
	  });
});

/* GET All jobs data. */
router.get('/', function(req, res, next) {
	
	var connectionString = 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=' + configDB.dbPath + ';Persist Security Info=False;';
	const connection = ADODB.open(connectionString);
	
	connection
	  .query('select * from Table_JobRun')
	  .then(data => {    
	    res.send(data);  
	  })
	  .catch(error => {
	    console.error(error);
	  });
});


module.exports = router;
