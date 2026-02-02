import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcryptjs';

const mockBorrowerService = {
  getBorrowerByEmail: jest.fn()
};

let AuthController;

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController.login', () => {
  beforeEach(async () => {
    mockBorrowerService.getBorrowerByEmail.mockReset();

    
    await jest.unstable_mockModule('../config/container.js', () => ({
      __esModule: true,
      default: {
        getService: () => mockBorrowerService
      }
    }));

    const mod = await import('../Controllers/AuthController.js');
    AuthController = mod.default;
  });

  test('returns token and user on successful login', async () => {
    const password = 'secretPassword';
    const hashed = bcrypt.hashSync(password, 8);

    mockBorrowerService.getBorrowerByEmail.mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: hashed
    });

    const req = { body: { email: 'test@example.com', password } };
    const res = makeRes();
    const next = jest.fn();

    await AuthController.login(req, res, next);

    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[res.json.mock.calls.length - 1][0];
    expect(payload.message).toBe('Login successful');
    expect(payload.token).toBeDefined();
    expect(payload.user.email).toBe('test@example.com');
  });

  test('returns 401 when user not found', async () => {
    mockBorrowerService.getBorrowerByEmail.mockResolvedValue(null);

    const req = { body: { email: 'missing@example.com', password: 'whatever' } };
    const res = makeRes();
    const next = jest.fn();

    await AuthController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  test('returns 401 when password is incorrect', async () => {
    const password = 'correctPassword';
    const hashed = bcrypt.hashSync(password, 8);

    mockBorrowerService.getBorrowerByEmail.mockResolvedValue({
      id: 2,
      name: 'Another User',
      email: 'another@example.com',
      phone: '0987654321',
      password: hashed
    });

    const req = { body: { email: 'another@example.com', password: 'wrongPassword' } };
    const res = makeRes();
    const next = jest.fn();

    await AuthController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });
});
