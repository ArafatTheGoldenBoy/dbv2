const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const fs = require('fs');
const fastcsv = require("fast-csv")
const mysql = require("mysql");
const connection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dwt'
});
connection.connect(console.log("conected"))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
exports.all_users = (req, res) => {
    connection.query(
        'SELECT * FROM `users`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};
let getUserId;
exports.getLogin = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(getUserId));
    res.end();
}
exports.login = (req,res) => {
    const sql = "select * from `users` where `user_name` = ?";
    const user_name = req.body.user_name;
    const pass = req.body.password;
    connection.query(sql, user_name, async (err, result) => {
        if (err) throw err;
        getUserId = result[0].user_id;
        const match = await bcrypt.compare(pass, result[0].password);
        if (match) {
            switch (result[0].user_type) {
            case 'admin':
                console.log('logged in as a admin');
                res.redirect('http://localhost/api/admin.php')
                break;
            case 'teacher':
                console.log('logged in as a teacher');
                res.redirect('http://localhost/api/teacher.php')
                break;
            case 'student':
                console.log('logged in as a student');
                res.redirect('http://localhost/api/student.php')
                break;
            default:
                res.json('auth failed')
                break;
            }
        }
        else res.json('auth failed')
    });
}
exports.addUser = async (req, res) => {
    const sql = "INSERT INTO users set ?";
    const hash2 = await bcrypt.hash(req.body.password, 10);
    const data = {
        user_name: req.body.user_name,
        password: hash2,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_type: req.body.user_type,
        created_at: new Date()
    }
    connection.query(sql, data, (err, result) => {
        if (err) throw err;
        console.log("1 record inserted");
    });
    console.log(data)
    res.redirect("/users");
}
exports.edit_user = (req, res) => {
    const userId = req.params.Id;
    connection.query(
        'SELECT * FROM `users` where user_id = ?', userId,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}
exports.update_user = async (req, res) => {
    const userId = req.params.Id;
    const user_name = req.body.user_name;
    const password = await bcrypt.hash(req.body.password, 10);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const user_type = req.body.user_type;
    let response = await fetch('http://localhost:5000/users');
    let result = await response.json();
    let userType;
    result.forEach(obj => {
        userType = obj.user_type
    })
    switch (userType) {
        case 'student':
            const sql = 'update users set user_name = ?, password = ?, first_name = ?, last_name = ?  where user_id = ?'
            connection.query(sql, [user_name, password, first_name, last_name, userId], (err, result) => {
                if (err) throw err;
                console.log("1 record updated");
            });
            res.redirect("/api/v1.1/all_users");
            break;
        case 'teacher':
            const sql2 = 'update users set user_name = ?, password = ?, first_name = ?, last_name = ?  where user_id = ?'
            connection.query(sql2, [user_name, password, first_name, last_name, userId], (err, result) => {
                if (err) throw err;
                console.log("1 record updated");
            });
            res.redirect("/api/v1.1/all_users");
            break;
        case 'admin':
            const sql3 = 'update users set user_name = ?, password = ?, first_name = ?, last_name = ?, user_type = ?  where user_id = ?'
            connection.query(sql3, [user_name, password, first_name, last_name, user_type, userId], (err, result) => {
                if (err) throw err;
                console.log("1 record updated");
            });
            res.redirect("/api/v1.1/all_users");
            break;
        default:
            break;
    }
}
exports.delete_user = (req, res) => {
    const userId = req.params.Id;
    let userType;
    let isEmpty = false;
    connection.query(
        'SELECT user_type FROM `users` where user_id = ?', userId,
        function (err, results, fields) {
            results.forEach(obj => {
                userType = obj.user_type
            })
            if (userType == "teacher") {
                connection.query(
                    'SELECT u.user_id FROM users u INNER join assign_teacher a on u.user_id = a.user_id INNER JOIN subject s on s.subject_id = a.subject_id where a.user_id = ? and s.is_archived = 0', userId,
                    function (err, results, fields) {
                        if (results[0] == null) {
                            connection.query(
                                'delete FROM `users` where user_id = ?', userId,
                                function (err, results, fields) {
                                    if (err) throw err;
                                    console.log("1 record is deleted");
                                }
                            );
                            res.redirect("/users");
                        }
                        else {
                            res.sendStatus(401)
                        }
                    }
                );
            }
            else if (userType == "student") {
                const sql2 = 'DELETE FROM mark WHERE user_id = ?' 
                const sql3 = 'DELETE FROM test WHERE user_id = ?' // not necessary
                const sql4 = 'DELETE FROM assigned_pupil WHERE user_id = ?'
                const sql5 = 'DELETE FROM users WHERE user_id = ?'
                connection.query(sql2, userId, function (err, results, fields) {
                        if (err) throw err;
                        console.log("1 record is deleted");
                        connection.query(sql4, userId, function (err, results, fields) {
                            if (err) throw err;
                            console.log("1 record is deleted");
                            connection.query(sql5, userId, function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is deleted");
                                res.status(200).send("Deleted successfully")
                            }
                        );
                        }
                    );
                    }
                );
                
            }
            else {
                if (err) throw err;
                console.log(userType);
            }
        }
    );
}
exports.list_of_assign_student = async (req, res) => {
    const userId = req.params.Id;
    let incoming_id = 0;
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    result.forEach(obj => {
        incoming_id = obj.user_id;
    })
                connection.query(
                    'SELECT * FROM assigned_pupil ap INNER join class c on ap.class_id = c.class_id WHERE ap.user_id = ?', userId,
                    function (err, results, fields) {
                        res.send(results); // results contains rows returned by server
                    }
                );
}
exports.list_of_assign_available_student = async (req, res) => {
    const userId = req.params.Id;
                let assignedClass = 0;
                connection.query(
                    'SELECT c.class_id from class c INNER join assigned_pupil ap on c.class_id = ap.class_id where ap.user_id = ?', userId,
                    function (err, results, fields) {
                        results.forEach(obj => {
                            assignedClass = obj.class_id
                        })
                        console.log(assignedClass)
                        connection.query(
                            'SELECT * from class where not class_id = ?', assignedClass,
                            function (err, results, fields) {
                                res.send(results)
                            }
                        );
                    }
                );
}
exports.assign_student_a_class = async (req, res) => {
    const userId = req.params.Id; // student id
    let classID = req.params.class_id;
    let data = {
        class_id: classID,
        user_id: userId // student id
    }
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    switch (result[0].user_type) {
        case 'student':
            let assignedClass = 0;

            connection.query(
                'SELECT c.class_id from class c INNER join assigned_pupil ap on c.class_id = ap.class_id where ap.user_id = ?', userId,
                function (err, results, fields) {
                    results.forEach(obj => {
                        assignedClass = obj.class_id
                    })
                    console.log("assigned class id: " + assignedClass)
                    if (assignedClass == 0) {
                        connection.query(
                            'INSERT INTO assigned_pupil set ?', data,
                            function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is Inserted");
                            }
                        );
                    }
                    else {
                        connection.query(
                            'DELETE FROM `assigned_pupil` where user_id = ?', userId,
                            function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is deleted");
                                connection.query(
                                    'INSERT INTO `assigned_pupil` set ?', data,
                                    function (err, results, fields) {
                                        if (err) throw err;
                                        console.log("1 record is inserted");
                                        let count2=0;
                                        connection.query(
                                            'SELECT DISTINCT s.subject_id from subject s INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN mark m on m.test_id = t.test_id WHERE m.user_id = ?', userId,
                                            function (err, results, fields) {
                                                if (err) throw err;
                                                console.log("1 record is inserted");
                                                results.forEach(obj => {
                                                    count2 = count2 + 1;
                                                })
                                                console.log("counter: ",count2);
                                                if(count2 > 0){
                                                    results.forEach (obj => {
                                                        connection.query(
                                                            'update subject set is_archived = ?  where subject_id = ?', [1,obj.subject_id],
                                                            function (err, results, fields) {
                                                                if (err) throw err;
                                                            }
                                                        );
                                                    })
                                                    console.log('successfully subject archived')
                                                }
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                }
            );

            break;
        case 'admin':

            break;
        case 'teacher':

            break;
        default:
            break;
    }

}

exports.deassign_student_a_class = async (req, res) => {
    const userId = req.params.Id;
    let classID = req.params.class_id; //req.body.class_id
    let data = {
        class_id: classID,
        user_id: userId
    }
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    switch (result[0].user_type) {
        case 'student':
            let assignedClass = 0;

            connection.query(
                'SELECT c.class_id from class c INNER join assigned_pupil ap on c.class_id = ap.class_id where ap.user_id = ?', userId,
                function (err, results, fields) {
                    results.forEach(obj => {
                        assignedClass = obj.class_id
                    })
                    console.log("assigned class id: " + assignedClass)
                    if (assignedClass == 0) {
                        console.log('he dosent assigned to a class before')
                    }
                    else {
                        connection.query(
                            'DELETE FROM `assigned_pupil` where user_id = ? and class_id = ?', [userId,assignedClass],
                            function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is deleted");
                                        connection.query(
                                            'SELECT DISTINCT s.subject_id from subject s INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN mark m on m.test_id = t.test_id WHERE m.user_id = ?', userId,
                                            function (err, results, fields) {
                                                if (err) throw err;
                                                console.log("1 record is inserted");
                                                if(results.lenght > 0){
                                                    results.forEach (obj => {
                                                        connection.query(
                                                            'update subject set is_archived = ?  where subject_id = ?', [1,obj.subject_id],
                                                            function (err, results, fields) {
                                                                if (err) throw err;
                                                            }
                                                        );
                                                    })
                                                    console.log('successfully subject archived')
                                                }
                                            }
                                        );
                                    // }
                            }
                        );
                    }
                }
            );

            break;
        case 'admin':

            break;
        case 'teacher':

            break;
        default:
            break;
    }
}
exports.list_all_subject = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'admin') {
        connection.query(
            'SELECT s.subject_id, s.subject_name, s.class_id, s.is_archived, c.class_name, c.is_archived, ast.user_id, u.user_name FROM subject s INNER JOIN class c ON s.class_id = c.class_id INNER JOIN assign_teacher ast ON s.subject_id = ast.subject_id INNER JOIN users u ON ast.user_id = u.user_id',
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }
}
exports.addEditSubject = async (req, res) => {
    const operation_type = req.params.operation_type;
        let lastInsertedID = 0;
        switch (operation_type) {
            case 'addSubject':
                const sql = "INSERT INTO `subject` set ?";
                const insertData = {
                    subject_name: req.body.subject_name,
                    class_id: req.body.class_id,
                    is_archived: 0
                }
                connection.query(sql, insertData, async (err, result) => {
                    if (err) throw err;
                    console.log(result.insertId)
                    lastInsertedID = await result.insertId;
                    console.log("1 record inserted");
                    if (lastInsertedID != 0) {
                        let qry = `INSERT INTO assign_teacher (user_id, subject_id, created_at) VALUES ( ?, ?, ?)`
                        connection.query(qry, [req.body.teacher_id, lastInsertedID, new Date()], function (err, data) {
                            if (err) throw err;
                            console.log("1 record inserted for assign_teacher");
                        });
                    }
                    else {
                        console.log("not working");
                    }
                });

                break;
            case 'editSubject':
                const sqlQry = 'UPDATE subject SET subject_name = ?, class_id = ?  where subject_id = ?';
                let subject_id = req.body.subject_id;
                let subject_name = req.body.subject_name;
                let class_id = req.body.class_id;

                connection.query(sqlQry, [subject_name, class_id, subject_id], (err, result) => {
                    if (err) throw err;
                    console.log("1 record updated");
                });

                let qry = `UPDATE assign_teacher SET user_id = ?  where subject_id = ?` // not nessessary
                connection.query(qry, [req.body.teacher_id, req.body.subject_id], function (err, data) {
                    if (err) throw err;
                    console.log("1 record inserted for assign_teacher");
                });
                break;
            default:
                break;
        }
}
exports.showSubjectInfo = async (req, res) => {
    const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    console.log(userId)
    console.log(subjectId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'admin') {
        connection.query(
            'SELECT s.subject_id, s.subject_name, s.is_archived,s.class_id, c.class_name, ast.user_id, u.user_name FROM subject s INNER JOIN class c ON s.class_id = c.class_id INNER JOIN assign_teacher ast ON s.subject_id = ast.subject_id INNER JOIN users u ON ast.user_id = u.user_id WHERE s.subject_id = ?', subjectId,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    }
}
exports.archiveSubject = async (req, res) => {
    const subjectId = req.params.subject_id;
    console.log(subjectId)
        connection.query(
            'SELECT count(*) AS testCount FROM test WHERE subject_id = ?', subjectId,
            function (err, results, fields) {
                if (err) throw err;
                if (results[0].testCount > 0) {
                    const sqlQry = 'UPDATE subject SET is_archived = ?  where subject_id = ?';
                    connection.query(sqlQry, [1, Number(subjectId)], (err, result) => {
                        if (err) throw err;
                        console.log("1 record updated");
                    });
                } else {
                    console.log("This subject has no test");
                }
            }
        );
}
exports.student_view = async (req, res) => {
    const userId = req.params.Id;
        connection.query(
            'SELECT * from assigned_pupil ap INNER JOIN class c on c.class_id = ap.class_id INNER JOIN subject s on s.class_id=c.class_id WHERE ap.user_id = ?', userId,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
}
exports.list_student_subject = async (req, res) => {
    const userId = req.params.Id; // teacher id
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    let subject_id = req.params.subject_id;

    if (result[0].user_type == 'teacher') {
        const sqlQry = 'SELECT *, (SELECT AVG(m.marks) from mark m INNER JOIN test t on t.test_id = m.test_id WHERE m.user_id = ap.user_id and t.subject_id = ?) as AverageGrade FROM subject s inner join class c on c.class_id = s.class_id inner join assigned_pupil ap on ap.class_id=c.class_id where s.subject_id=?';
        connection.query(sqlQry, [subject_id, subject_id], (err, results) => {
            if (err) throw err;
            res.send(results); // results contains rows returned by server
        });
    } else {
        //code for deny permission
    }

}

exports.add_test = async (req, res) => {
    const subject = req.params.subject_id;
        const sql = "INSERT INTO `test` set ?";
        const insertData = {
            test_name: req.body.test_name,
            subject_id: subject,
            date: req.body.test_date,
            is_complete: 0
        }
        connection.query(sql, insertData, async (err, result) => {
            if (err) throw err;
            console.log(result.insertId)
        });
}
exports.edit_test = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    if (result[0].user_type == 'teacher') {
        const sqlQry = 'UPDATE test SET test_name = ?, date = ?  where test_id = ?';
        let test_name = req.body.test_name;
        let date = req.body.test_date;
        let test_id = req.body.test_id;
        let subject_id = req.body.subject_id;
        connection.query(sqlQry, [test_name, date, test_id], (err, result) => {
            if (err) throw err;
            console.log("1 record updated");
            res.redirect('/users/list_test_subject/' + userId + '/' + subject_id)
        });
    }
}
exports.list_test_subject = async (req, res) => {
    const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();


    if (result[0].user_type == 'teacher') {
        connection.query(
            'SELECT * from test where subject_id = ?', subjectId,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }
}
exports.list_student_test = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    const test_id = req.params.test_id;
    if (result[0].user_type == 'teacher') {
        connection.query(
            'SELECT u.user_name, u.first_name, u.last_name, t.test_name, mk.marks from users u INNER JOIN mark mk on u.user_id = mk.user_id INNER JOIN test t on t.test_id = mk.test_id where t.test_id = ?', test_id,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }
}
exports.edit_grade_pupil = async (req, res) => {
    const userId = req.params.Id; // teacher id
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    if (result[0].user_type == 'teacher') {
        const sqlQry = 'UPDATE mark SET marks = ? where test_id = ? AND user_id = ?';
        let marks = req.body.grade;
        let user_id = req.body.user_id; // student id
        let test_id = req.body.test_id;
        connection.query(sqlQry, [marks, test_id, user_id], (err, result) => {
            if (err) throw err;
            console.log("Record updated");
            res.redirect('/users/list_student_test/' + userId + '/' + test_id)
        });
    }
}
exports.upload_csv_grade_pupil = async (req, res) => {
    //add validation for file upload first and have to be there a necessary csv file called 'markcsv.csv'
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    if (result[0].user_type == 'teacher') {
        let filepath = './upload/markcsv.csv'
        let filename = filepath;
        let stream = fs.createReadStream(filename);
        let csvData = [];
        //parse using fast-csv module; see in top about fastcsv require
        let csvStream = fastcsv.parse()
            .on("data", function (data) {
                csvData.push(data);
            })
            .on("end", function () {
                // remove the first line: header
                csvData.shift();
                // insert csvdata to database
                let qry = `INSERT INTO mark (test_id, user_id, marks) VALUES ?`;
                connection.query(qry, [csvData], function (err, data) {
                    if (err) throw err;
                    console.log(err || data);
                    console.log("record inserted for marks");
                    console.log('csv test id only : ',csvData[0][0])
                        let qry2 = `UPDATE test SET is_complete = ? where test_id = ?`;
                        connection.query(qry2, [1, csvData[0][0]], function (err, data) {
                            if (err) throw err;
                        });
                });
            });
        stream.pipe(csvStream);
    }
}
exports.deleteTest = async (req, res) => {
    const testId = req.params.test_id;
        const sql = `DELETE FROM mark WHERE test_id = ?`;
        const sql2 = `DELETE FROM test WHERE test_id = ?`;
        connection.query(
            sql, testId,
            function (err, results, fields) {
                if (err) throw err;
                console.log("1 record is deleted");
                connection.query(
                    sql2, testId,
                    function (err, results, fields) {
                        if (err) throw err;
                        console.log("1 record is deleted");
                    }
                );
            }
        );
}
exports.onlyTeacher=async (req,res)=>{
    console.log('|Teachers list')
    connection.query(
        `SELECT * FROM users where user_type = "teacher"`,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}
exports.studentList=async (req,res)=>{
    console.log('Student list')
    connection.query(
        `SELECT * FROM users where user_type = "student"`,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}
exports.all_class = (req,res) => {
    connection.query(
        'SELECT * FROM `class` where is_archived = 0',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};
exports.create_class = (req,res)=>{
    const sql = "INSERT INTO class set ?";
    const data = {
        class_name : req.body.class_name
    }
    connection.query(sql, data, (err, result, next) => {
        if (err) {
            throw err
        };
        console.log("1 record inserted");
    });
    console.log(data)
    res.status(200);
}
exports.edit_class = (req,res)=>{
    const classId = req.params.Id;
    connection.query(
        'SELECT * FROM `class` where class_id = ?', classId,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}
exports.update_class = (req,res)=>{
    const classId = req.params.Id;
    const isArchived = req.body.is_archived;
    const sql = 'update class set is_archived = ? where class_id = ?'
    connection.query(sql, [isArchived, classId], (err, result) => {
        if (err) throw err;
        console.log("1 record updated");
    });
    res.redirect("/api/v1/classes/");
}
exports.delete_class = (req,res)=>{
    const classId = req.params.Id;
    connection.query(
        'DELETE FROM `assigned_pupil` where class_id = ?', classId,
            function (err, results, fields) {
                if (err) throw err;
                console.log("1 record is deleted");
                connection.query (
                    'update class set is_archived = ? where class_id = ?', [1, classId], function (err, results, fields) { // is archiveed = 1 means class deleted
                        if (err) throw err;
                        console.log("1 record is updated");
                        connection.query (
                            'select subject_id from subject where class_id = ?', classId, function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is updated");
                                let subjectId = 0;
                                let count = 0;
                                results.forEach(element => {
                                    subjectId = element.subject_id
                                    
                                    connection.query (
                                        'select count(*) as count from test where subject_id = ?', subjectId, function (err, results, fields) {
                                            if (err) throw err;
                                            console.log('count',results[0].count)
                                            if (results[0].count == 0) {
                                                connection.query (
                                                    'delete from subject where subject_id = ?', subjectId, function (err, results, fields) {
                                                        if (err) throw err;
                                                        console.log("1 record is updated");
                                                    }
                                                )
                                                console.log("subject id : "+subjectId);
                                            }
                                            else {
                                                connection.query (
                                                    'update subject set is_archived = ? where subject_id = ?', [1, subjectId], function (err, results, fields) {
                                                        if (err) throw err;
                                                        console.log("1 record is updated");
                                                    }
                                                )
                                                console.log("subject id : "+subjectId);
                                            }
                                        }
                                    )
                                    
                                });
                                console.log(results);
                            }
                        )
                    }
                )
        }
    );
    res.redirect("/classes/");
}
exports.all_subject = (req, res) => {
    connection.query(
        'SELECT * FROM `subject`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};
exports.all_available_subject = (req, res) => {
    class_id = req.params.class_id;
    connection.query(
        'SELECT * FROM `subject` where class_id = ?', class_id,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};
exports.single_subject = (req,res)=>{
    const subjectId = req.params.subjectId;
    const userId = req.params.userId;//req.body.user_id;
    connection.query(
        'SELECT t.test_name,m.marks from subject s INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN mark m on m.test_id = t.test_id where m.user_id=? and s.subject_id = ?', [userId, subjectId],
        function (err, results, fields) {
            if (err) throw err;
            res.send(results);
        }
    );
}
exports.user_subjects = (req,res)=>{
    const userId = req.params.Id;
    connection.query(
        'SELECT * from subject s INNER JOIN class c on c.class_id = s.class_id INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN assigned_pupil ap on ap.class_id = s.class_id where ap.user_id = ?', userId,
        function (err, results, fields) {
            if (err) throw err;
            res.send(results);
        }
    );
}
exports.user_subjects_test_mean = (req,res)=>{
    const userId = req.params.Id;
    connection.query(
        'SELECT AVG(m.marks) from mark m where user_id = ?', userId,
        function (err, results, fields) {
            if (err) throw err;
            res.send(results);
        }
    );
}
exports.list_assign_subject = async (req, res) => {
    const userId = req.params.Id; // teacher id
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    
    if (result[0].user_type == 'teacher') {
        const sqlQry = 'select * from assign_teacher atc INNER JOIN subject s on s.subject_id = atc.subject_id where atc.user_id = ?';
        connection.query(sqlQry, userId, (err, results) => {
            if (err) throw err;
            res.send(results); // results contains rows returned by server
        });
    } else {
        //code for deny permission
    }
}
exports.deleteSubject = async (req, res) => {
    const subjectId = req.params.subject_id;
    console.log(subjectId)
        connection.query(
            'SELECT count(*) AS testCount FROM test WHERE subject_id = ?', subjectId,
            function (err, results, fields) {
                if (err) throw err;
                console.log(results[0].testCount)
                if (Number(results[0].testCount) > 0) {
                    console.log("This subject has records");
                } else {
                    const qry = 'DELETE FROM subject where subject_id = ?';
                    connection.query(qry, [subjectId], (err, result) => {
                        if (err) throw err;
                        console.log("1 record deleted");
                    });
                }
            }
        );
}
exports.assign_teacher = async (req,res) => {
    const user_id = req.body.id;
    const subjectId = req.params.subject_id;
    const created_at = new Date();

    const sql = 'INSERT INTO assign_teacher set ?';
    connection.query(sql, [user_id,subjectId,created_at], (err, results) => {
        if (err) throw err;
        res.status(200).send('Inserted successfully'); // results contains rows returned by server
    });
}
exports.all_test = (req, res) => {
    connection.query(
        'SELECT * FROM `test`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};
exports.get_all_subject_grades = (req, res) => {
    const userId = req.params.Id;
    connection.query(
        'SELECT s.subject_id, (SELECT AVG(m.marks) from mark m INNER JOIN test t on t.test_id = m.test_id where t.subject_id = s.subject_id and m.user_id = ?) as AverageGrade FROM subject s inner join class c on c.class_id = s.class_id inner join assigned_pupil ap on ap.class_id=c.class_id where ap.user_id=?', [userId,userId],
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};