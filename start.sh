2 #!/bin/bash

# Hospital Website - Quick Start Script

echo "🏥 Hospital Website Setup"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Creating .env file from example..."
    cp backend/.env.example backend/.env
    echo "✅ .env created. Please edit backend/.env with your MongoDB URI"
    echo ""
fi

# Check if MongoDB is running (local)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Starting MongoDB..."
        # Try to start MongoDB
        if command -v systemctl &> /dev/null; then
            sudo systemctl start mongod
        elif command -v brew &> /dev/null; then
            brew services start mongodb-community
        else
            echo "❌ Please start MongoDB manually"
        fi
    fi
else
    echo "ℹ️  MongoDB not found locally. Using remote MongoDB (Atlas)?"
fi

echo ""
echo "Starting Backend Server..."
echo "=========================="
cd backend
npm install
npm start &
BACKEND_PID=$!
cd ..

echo ""
echo "Waiting for backend to start..."
sleep 5

echo ""
echo "Starting Frontend Development Server..."
echo "========================================"
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers started!"
echo ""
echo "📝 Access your application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
