const scoutpass = document.createElement('a')
scoutpass.href = `http://${
    window.location.host.split(':')[0] || 'localhost'
}:8000`
scoutpass.target = '_blank'
scoutpass.innerHTML = 'Generate'

// Add link to document
document.getElementById('nav').appendChild(scoutpass)
