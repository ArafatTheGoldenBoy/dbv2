const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const Controller = require("../Controller/Controller");
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
router.get("/users", Controller.all_users);
router.get("/users/onlyTeacher", Controller.onlyTeacher);
router.get("/users/studentList", Controller.studentList);
router.post("/users", Controller.addUser);
router.get("/login", Controller.getLogin);
router.post("/login", Controller.login);
router.post("/register", Controller.addUser);
router.get("/users/:Id", Controller.edit_user)
router.put("/users/:Id", Controller.update_user)
router.delete("/users/:Id", Controller.delete_user)
router.get("/users/assignList/:Id", Controller.list_of_assign_student)
router.get("/users/assignAvailableList/:Id", Controller.list_of_assign_available_student)
router.post("/users/assignStudent/:Id/:class_id", Controller.assign_student_a_class)
router.post("/users/deassignStudent/:Id/:class_id", Controller.deassign_student_a_class)
router.get("/users/studentView/:Id", Controller.student_view)
router.get("/users/sub_list/:Id", Controller.list_all_subject);
router.post("/users/add_edit_subject/:operation_type", Controller.addEditSubject);
router.get("/users/archive_subject/:subject_id", Controller.archiveSubject)
router.get("/users/edit_subject/:Id/:subject_id", Controller.showSubjectInfo);
router.get("/users/list_student_subject/:Id/:subject_id", Controller.list_student_subject);
router.post("/users/add_test/:subject_id", Controller.add_test);
router.put("/users/edit_test/:Id", Controller.edit_test);
router.get("/users/list_test_subject/:Id/:subject_id", Controller.list_test_subject);
router.get("/users/list_student_test/:Id/:test_id", Controller.list_student_test);
router.put("/users/edit_grade_pupil/:Id", Controller.edit_grade_pupil);
router.get("/users/upload_csv_grade_pupil/:Id", Controller.upload_csv_grade_pupil);
router.delete("/users/deleteTest/:test_id", Controller.deleteTest);
router.get("/api/v1/all_test", Controller.all_test);
router.get("/api/v1/get_all_subject_grades/:Id", Controller.get_all_subject_grades);
router.get("/all_subjects", Controller.all_subject);
router.get("/all_subjects/:class_id", Controller.all_available_subject);
router.get("/singleSubject/:userId/:subjectId", Controller.single_subject);
router.get("/userSubjects/:Id", Controller.user_subjects);
router.get("/userSubjectsMeanResults/:Id", Controller.user_subjects_test_mean);
router.get("/users/list_assign_subject/:Id", Controller.list_assign_subject);
router.delete("/users/delete_subject/:subject_id", Controller.deleteSubject);
router.post("/users/assign_teacher/:subject_id", Controller.assign_teacher);
router.get("/classes", Controller.all_class)
router.post("/classes", Controller.create_class)
router.get("/classes/:Id", Controller.edit_class)
router.put("/classes/:Id", Controller.update_class)
router.delete("/classes/:Id", Controller.delete_class)
module.exports = router;