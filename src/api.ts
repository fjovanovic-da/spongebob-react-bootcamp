/**
 * HTTP Client utility for making API requests
 */

import axios from "axios";
import type { User } from "./components/types";
import { DEFAULT_TIMEOUT } from "./config";

class HttpClient {
  /**
   * Fetch users from the API
   * @param url - The URL to fetch users from
   * @returns Promise with list of users
   */
  async getUsers(url: string): Promise<User[]> {
    const response = await axios.get<User[]>(url, {
      timeout: DEFAULT_TIMEOUT,
    });
    return response.data;
  }
}

// Export a singleton instance
export const httpClient = new HttpClient();
