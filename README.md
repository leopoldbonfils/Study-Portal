# Student Course Registration System

A React-based course registration system for AUCA (Adventist University of Central Africa) that allows students to select, register, and manage their courses for the semester.

## Features

- 📚 **Course Selection** - Browse and select from available courses
- 👥 **Group Management** - Choose from available groups with real-time availability
- 💰 **Fee Calculation** - Automatic calculation of tuition fees and total costs
- 📊 **Registration Overview** - View all registered courses in a comprehensive table
- ❌ **Course Withdrawal** - Remove courses from registration
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Screenshot

The system displays:
- Student information (Name, Registration Number, Faculty, Department)
- Course selection form with dropdowns
- Fees summary table with credit costs
- Registered courses table with schedule details

## Technologies Used

- **React** - Frontend framework
- **CSS3** - Styling and responsive design
- **JavaScript ES6+** - Modern JavaScript features

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/leopoldbonfils/Study-Portal.git
   cd study-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
study-portal/
├── public/
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   └── index.js        # Entry point
├── package.json
└── README.md
```

## Usage

### Registering a Course

1. Select a course from the **Select course** dropdown
2. The course code will automatically populate
3. Choose a group from the **Group** dropdown
4. Review the schedule details (Room, Day, Hour)
5. Click the **Add a Course** button
6. The course will appear in both the Fees Summary and Registered Courses tables

### Withdrawing a Course

1. Locate the course in the **Registered courses** table
2. Click the **Withdraw** button in the Action column
3. The course will be removed from your registration

### Viewing Fees

The **Fees summary** table displays:
- Course code and name
- Number of credits
- Credit cost
- Total amount per course
- Registration fee
- Grand total

## Available Courses

The system includes the following courses:

| Course Code | Course Name | Credits |
|------------|-------------|---------|
| ENGL 8124 | Academic English Writing | 3 |
| COSC 8312 | Introduction to Linux | 3 |
| INSY 8322 | Web Technology and Internet | 4 |
| INSY 8411 | Dot Net | 4 |
| SENG 8323 | Software Modeling Design | 4 |
| SENG 8415 | Best Programming Practice Design Patterns | 3 |

## Fee Structure

- **Credit Cost**: 21,407 RWF per credit
- **Registration Fee**: 25,000 RWF
- **Life Assurance Fee**: 0.00 RWF
- **Graduation Fee**: 0.00 RWF

Total fees are calculated automatically based on registered courses.

## Customization

### Adding New Courses

Edit the `availableCourses` array in `App.js`:

```javascript
const availableCourses = [
  {
    name: 'Course Name',
    code: 'DEPT 1234',
    groups: ['A', 'B'],
    schedules: {
      'A': { room: 'G101', day: 'MONDAY', hour: '10', maxGpe: 60, current: 45 },
      'B': { room: 'G102', day: 'TUESDAY', hour: '14', maxGpe: 60, current: 50 }
    },
    credits: 3,
    creditCost: 21407
  },
  // Add more courses...
];
```

### Modifying Student Information

Update the student information in the header section of `App.js`:

```javascript
<div className="info-item">
  <span className="info-label">Full name:</span>
  <span className="info-value">Your Name</span>
</div>
```

### Changing Styling

Modify `App.css` to customize colors, fonts, and layout:

```css
.btn-primary {
  background-color: #your-color;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Known Issues

- None at the moment

## Future Enhancements

- [ ] Backend integration with database
- [ ] User authentication
- [ ] Course search functionality
- [ ] Export registration to PDF
- [ ] Email confirmation of registration
- [ ] Payment integration
- [ ] Course prerequisites checking
- [ ] Schedule conflict detection
- [ ] Multiple semester support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

**Developer**: Mugisha Leopold and Danny Bisubizo Jospin 
**Email**: leopordBnfils@gmail.com  
**University**: Adventist University of Central Africa (AUCA)

## Acknowledgments

- AUCA IT Department
- React Community
- All contributors

---

**Note**: This is a frontend-only application. For production use, integrate with a backend API for data persistence and security.
