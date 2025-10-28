const r3 = 1.7320508075688772;
const hr3 = 0.8660254037844386;
const ident = [1, 0, 0, 0, 1, 0];

function pt( x, y )
{
	return { x : x, y : y };
}

function hexPt( x, y )
{
	return pt( x + 0.5*y, hr3*y );
}

// Affine matrix inverse
function inv( T ) {
	const det = T[0]*T[4] - T[1]*T[3];
	return [T[4]/det, -T[1]/det, (T[1]*T[5]-T[2]*T[4])/det,
		-T[3]/det, T[0]/det, (T[2]*T[3]-T[0]*T[5])/det];
};

// Affine matrix multiply
function mul( A, B )
{
	return [A[0]*B[0] + A[1]*B[3], 
		A[0]*B[1] + A[1]*B[4],
		A[0]*B[2] + A[1]*B[5] + A[2],

		A[3]*B[0] + A[4]*B[3], 
		A[3]*B[1] + A[4]*B[4],
		A[3]*B[2] + A[4]*B[5] + A[5]];
}

function padd( p, q )
{
	return { x : p.x + q.x, y : p.y + q.y };
}

function psub( p, q )
{
	return { x : p.x - q.x, y : p.y - q.y };
}

// Rotation matrix
function trot( ang )
{
	const c = cos( ang );
	const s = sin( ang );
	return [c, -s, 0, s, c, 0];
}

// Translation matrix
function ttrans( tx, ty )
{
	return [1, 0, tx, 0, 1, ty];
}

function rotAbout( p, ang )
{
	return mul( ttrans( p.x, p.y ), 
		mul( trot( ang ), ttrans( -p.x, -p.y ) ) );
}

// Matrix * point
function transPt( M, P )
{
	return pt(M[0]*P.x + M[1]*P.y + M[2], M[3]*P.x + M[4]*P.y + M[5]);
}

// Match unit interval to line segment p->q
function matchSeg( p, q )
{
	return [q.x-p.x, p.y-q.y, p.x,  q.y-p.y, q.x-p.x, p.y];
};

// Match line segment p1->q1 to line segment p2->q2
function matchTwo( p1, q1, p2, q2 )
{
	return mul( matchSeg( p2, q2 ), inv( matchSeg( p1, q1 ) ) );
};

// Intersect two lines defined by segments p1->q1 and p2->q2
function intersect( p1, q1, p2, q2 )
{
    const d = (q2.y - p2.y) * (q1.x - p1.x) - (q2.x - p2.x) * (q1.y - p1.y);
    const uA = ((q2.x - p2.x) * (p1.y - p2.y) - (q2.y - p2.y) * (p1.x - p2.x)) / d;
    // const uB = ((q1.x - p1.x) * (p1.y - p2.y) - (q1.y - p1.y) * (p1.x - p2.x)) / d;

    return pt( p1.x + uA * (q1.x - p1.x), p1.y + uA * (q1.y - p1.y) );
}

const hat_hex_base = [
        [0, 0], [-1, -1], [0, -2], [2, -2],
        [2, -1], [4, -2], [5, -1], [4, 0],
        [3, 0], [2, 2], [0, 3], [0, 2],
        [-1, 2] ];

const hat_hex_offsets = [
        [0, 0], [-0.3, -0.2], [-0.1, -0.3], [0.35, -0.25],
        [0.25, 0.6], [0.55, -0.25], [0.65, 0.55], [0.35, 0.35],
        [0.2, 0.5], [-0.6, 0.45], [-0.55, 0.3], [-0.2, 0.45],
        [-0.15, 0.35] ];

function clamp01( s )
{
        return Math.max( 0, Math.min( 1, s ) );
}

function buildHatOutline( s )
{
        const t = clamp01( s );
        const outline = [];

        for( let idx = 0; idx < hat_hex_base.length; ++idx ) {
                const base = hat_hex_base[idx];
                const offset = hat_hex_offsets[idx];
                outline.push( hexPt(
                        base[0] + offset[0] * t,
                        base[1] + offset[1] * t ) );
        }

        return outline;
}

let hat_outline = buildHatOutline( 0 );
