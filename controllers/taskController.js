const Task = require('../models/Task.js');

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const { search, category, sort } = req.query;
  let query = { user: req.userId };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) query.category = category;

  let sortOptions = {};
  if (sort === 'dueDate') sortOptions.dueDate = 1;
  else if (sort === 'createdAt') sortOptions.createdAt = -1;
  else if (sort === 'status') sortOptions.isCompleted = 1;

  try {
    const tasks = await Task.find(query).sort(sortOptions);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleCompleted = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.isCompleted = !task.isCompleted;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};