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

const hat_shape_library = {
        'hat': {
                outline: [
                        [0, 0],
                        [-1.5, -0.8660254037844386],
                        [-1, -1.7320508075688772],
                        [1, -1.7320508075688772],
                        [1.5, -0.8660254037844386],
                        [3, -1.7320508075688772],
                        [4.5, -0.8660254037844386],
                        [4, 0],
                        [3, 0],
                        [3, 1.7320508075688772],
                        [1.5, 2.598076211353316],
                        [1, 1.7320508075688772],
                        [0, 1.7320508075688772]
                ],
                tiles: {
                        'H': {
                                shape: [
                                        [0, 0], [4, 0], [4.5, 0.8660254037844386],
                                        [2.5, 4.330127018922193], [1.5, 4.330127018922193], [-0.5, 0.8660254037844386]
                                ],
                                width: 2,
                                children: [
                                        { T: [-0.24999999999999997, 0.4330127018922194, 1, -0.4330127018922194, -0.24999999999999997, 1.7320508075688774], label: 'H' },
                                        { T: [-0.25, 0.4330127018922193, 4, -0.4330127018922193, -0.25, 1.7320508075688772], label: 'H' },
                                        { T: [-0.25000000000000006, -0.43301270189221935, 2.5, 0.43301270189221935, -0.25000000000000006, 2.598076211353315], label: 'H' },
                                        { T: [-0.25, 0.4330127018922193, 2.5, 0.4330127018922193, 0.25, 0.8660254037844386], label: 'H1' }
                                ]
                        },
                        'T': {
                                shape: [
                                        [0, 0], [3, 0], [1.5, 2.598076211353316]
                                ],
                                width: 2,
                                children: [
                                        { T: [0.5, 0, 0.5, 0, 0.5, 0.8660254037844386], label: 'T' }
                                ]
                        },
                        'P': {
                                shape: [
                                        [0, 0], [4, 0], [3, 1.7320508075688772], [-1, 1.7320508075688772]
                                ],
                                width: 2,
                                children: [
                                        { T: [0.5, 0, 1.5, 0, 0.5, 0.8660254037844386], label: 'P' },
                                        { T: [0.25, 0.4330127018922193, 0, -0.4330127018922193, 0.25, 1.7320508075688772], label: 'P' }
                                ]
                        },
                        'F': {
                                shape: [
                                        [0, 0], [3, 0], [3.5, 0.8660254037844386], [3, 1.7320508075688772], [-1, 1.7320508075688772]
                                ],
                                width: 2,
                                children: [
                                        { T: [0.5, 0, 1.5, 0, 0.5, 0.8660254037844386], label: 'F' },
                                        { T: [0.25, 0.4330127018922193, 0, -0.4330127018922193, 0.25, 1.7320508075688772], label: 'F' }
                                ]
                        }
                }
        },
        'spectre': {
                outline: [
                        [0, 0],
                        [-1.9, -1.0392304845413263],
                        [-1.25, -1.9918584287042087],
                        [1.225, -1.9485571585149868],
                        [2.05, -0.34641016151377546],
                        [3.425, -1.9485571585149868],
                        [5.425000000000001, -0.3897114317029973],
                        [4.5249999999999995, 0.3031088913245535],
                        [3.45, 0.4330127018922193],
                        [2.625, 2.1217622392718747],
                        [1.0999999999999999, 2.857883832488647],
                        [1.0250000000000001, 2.1217622392718747],
                        [0.025000000000000133, 2.035159698893431]
                ],
                tiles: {
                        'H': {
                                shape: [
                                        [0, 0], [4, 0], [4.5, 0.8660254037844386],
                                        [2.5, 4.330127018922193], [1.5, 4.330127018922193], [-0.5, 0.8660254037844386]
                                ],
                                width: 2,
                                children: [
                                        { T: [-0.22292993630573252, 0.3309651224653906, 0.9084394904458599, -0.3309651224653906, -0.22292993630573252, 1.565189224992576], label: 'H' },
                                        { T: [-0.3125, 0.5412658773652741, 3.671875, -0.5412658773652741, -0.3125, 2.0838736278563053], label: 'H' },
                                        { T: [-0.17515923566878983, -0.35854554933750654, 2.401273885350318, 0.35854554933750654, -0.17515923566878983, 2.760800729898799], label: 'H' },
                                        { T: [-0.25, 0.4330127018922193, 2.5, 0.4330127018922193, 0.25, 0.8660254037844386], label: 'H1' }
                                ]
                        },
                        'T': {
                                shape: [
                                        [0, 0], [3, 0], [1.5, 2.598076211353316]
                                ],
                                width: 2,
                                children: [
                                        { T: [0.5, 0, 0.5, 0, 0.5, 0.8660254037844386], label: 'T' }
                                ]
                        },
                        'P': {
                                shape: [
                                        [0, 0], [4, 0], [3, 1.7320508075688772], [-1, 1.7320508075688772]
                                ],
                                width: 2,
                                children: [
                                        { T: [0.5, 0, 1.5, 0, 0.5, 0.8660254037844386], label: 'P' },
                                        { T: [0.25, 0.4330127018922193, 0, -0.4330127018922193, 0.25, 1.7320508075688772], label: 'P' }
                                ]
                        },
                        'F': {
                                shape: [
                                        [0, 0], [3, 0], [3.5, 0.8660254037844386], [3, 1.7320508075688772], [-1, 1.7320508075688772]
                                ],
                                width: 2,
                                children: [
                                        { T: [0.5, 0, 1.5, 0, 0.5, 0.8660254037844386], label: 'F' },
                                        { T: [0.25, 0.4330127018922193, 0, -0.4330127018922193, 0.25, 1.7320508075688772], label: 'F' }
                                ]
                        }
                }
        }
};

const hat_shape_keys = Object.keys( hat_shape_library );

function getHatShape( key )
{
        const data = hat_shape_library[key];
        if( data == null ) {
                throw new Error( `Unknown hat shape '${key}'` );
        }

        const tiles = {};
        for( const [name, tile] of Object.entries( data.tiles ) ) {
                tiles[name] = {
                        shape: tile.shape.map( (p) => pt( p[0], p[1] ) ),
                        width: tile.width,
                        children: tile.children.map( (child) => ({
                                T: child.T.slice(),
                                label: child.label
                        }) )
                };
        }

        return {
                outline: data.outline.map( (p) => pt( p[0], p[1] ) ),
                tiles: tiles
        };
}

function listHatShapeKeys()
{
        return hat_shape_keys.slice();
}

let hat_outline = getHatShape( 'hat' ).outline;
